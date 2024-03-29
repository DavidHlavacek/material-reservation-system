import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { CheckoutService } from '../../services/checkout.service';
import { Observable, map } from 'rxjs';
import { HistoryService } from '../../services/history.service';
import { History } from '../../models/History';

enum InfoType {
  None,
  Item,
  User,
  Reservation,
  Command,
}

@Component({
  selector: 'scan-barcode',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  providers: [ItemService, CheckoutService, HistoryService],
  templateUrl: './scan-barcode.component.html',
  styleUrl: './scan-barcode.component.css'
})
export class ScanBarcodeComponent implements AfterViewInit {
  InfoType = InfoType;
  scanForm: FormGroup;
  targetItem: any = null;
  targetUser: any = null;
  targetReservation: any = null;

  private scannedBarcode: string = "";
  private delayTimer: any;

  processStatus: string = "";
  userInstruction: string = "Scan item barcode to begin checkin/checkout";
  pageTitle: string = "Scan barcode";
  error: string = "";

  infoDisplayMode: InfoType = InfoType.None;
  errorDisplayMode: InfoType = InfoType.None;
  expectedBarcode: InfoType = InfoType.Item;
  isCheckout: boolean | null = null;

  constructor(
    private fb: FormBuilder, 
    private renderer: Renderer2, 
    private el: ElementRef,
    private itemService: ItemService,
    private historyService: HistoryService,
    private checkoutService: CheckoutService,
    ) {
    this.scanForm = this.fb.group({
      barcode: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.setFocus('barcode');
  }

  private resetForm(): void {
    this.scanForm.patchValue({
      barcode: null,
      // Add other form controls as needed
    });

    this.scanForm.markAsUntouched();
    this.scanForm.markAsPristine();
  }

  private setFocus(controlName: string): void {
    // eliminates the need to click on the box to fill out a form
    const element = this.el.nativeElement.querySelector(`#${controlName}`);
    if (element) {
      element.focus();
    }
  }

  // This is needed in order to let all the inputs from the barcode scanner to be registered
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const pressedKey = event.key;

    // Check if the pressed key is a number
    if (!isNaN(Number(pressedKey))) {
      this.scannedBarcode += pressedKey;

      // Clear any existing timer
      clearTimeout(this.delayTimer);

      // Set a new timer for 500 milliseconds (adjust the delay as needed)
      this.delayTimer = setTimeout(() => {
        this.handleBarcodeScanned(this.scannedBarcode);

        // Reset the scanned barcode for the next input
        this.scannedBarcode = '';
      }, 3000);
    }
  }

  async handleBarcodeScanned(barcode: string): Promise<void> {
    this.error = "";
    this.processStatus = "";
    this.errorDisplayMode = InfoType.None;
    if (barcode.startsWith("8900000000444")) {
        console.log("Received CANCEL barcode");
        this.cancelAll();
        this.resetForm();
        return;
    }
    if (this.expectedBarcode === InfoType.Item) {
      try {
        await this.getItemFromBackend(parseInt(barcode)); // Wait for getItemFromBackend to complete
        if (this.targetItem != null) {
          console.log('recognized item');
          const isUnique = this.isItemUnique();
          if (isUnique) {
            await this.getReservationFromBackend(parseInt(barcode)); // Wait for getReservationFromBackend to complete
            if (this.targetReservation) {
              this.userInstruction = "Enter Confirm or Cancel";
              this.expectedBarcode = InfoType.Command;
              this.infoDisplayMode = InfoType.Reservation;
              this.isCheckout = false;
              this.pageTitle = "Item Return";
              this.resetForm();
              return;
            }
            this.isCheckout = true;
            this.pageTitle = "Item Checkout";
          }
          this.userInstruction = "Scan borrower barcode";
          this.expectedBarcode = InfoType.User;
          }
      } catch (error) {
        this.targetItem = null;
        this.error = "Could not find item, please scan again";
        this.errorDisplayMode = InfoType.Item;
        console.error('Error fetching item details:', error);
      }
    }
    else if (this.expectedBarcode === InfoType.User) {
      await this.getBorrowerFromBackend(parseInt(barcode));
      if (this.targetUser) {
        this.userInstruction = "Enter Confirm or Cancel";
        this.expectedBarcode = InfoType.Command;
        this.infoDisplayMode = InfoType.User;
        if (!this.targetReservation) {
          await this.getReservationFromBackend(this.targetItem.itemId, this.targetUser.NFCId);
          if (this.targetReservation) {
            this.isCheckout = false;
            this.pageTitle = "Item Return";
          }
          else {
            this.isCheckout = true;
            this.pageTitle = "Item Checkout";
          }
        }
      }
    }
    else if (this.expectedBarcode == InfoType.Command) {
      if (barcode.startsWith('8900000000777')) {
        if (this.targetItem && (this.targetUser || !this.isCheckout)) {
          if (this.isCheckout === true) {
            await this.checkoutService.checkoutItem(parseInt(this.targetItem.ItemID), this.targetUser.UserID);
            this.processStatus = "Successfully checked out an item";
          } else {
            await this.checkoutService.returnItem(parseInt(this.targetItem.ItemID));
            this.processStatus = "Successfully returned an item";
          }
        } else {
          this.error = "Missing required information, scan CANCEL to continue";
          console.log(this.targetItem, this.targetUser, this.targetReservation);
          this.errorDisplayMode = InfoType.Command;
        }
      }
    }
    this.resetForm();
  }

  cancelAll(): void {
    this.processStatus = "Cancelled current process";
    this.pageReset();
  }

  pageReset(): void {
    this.resetForm();
    this.setFocus('barcode');
    this.targetItem = null;
    this.targetReservation = null;
    this.targetUser = null;
    this.error = "";
    this.pageTitle = "Scan barcode";
    this.userInstruction = "Scan item barcode to begin";
    this.expectedBarcode = InfoType.Item;
  }

  async getItemFromBackend(barcode: number): Promise<void> {
    return new Promise((resolve, reject) => {
        this.checkoutService.getItemByBarcode(barcode).subscribe(
            (itemDetails) => {
                if (itemDetails) {
                    this.targetItem = itemDetails[0];
                    console.log(this.targetItem);
                    resolve(); // Resolve the promise when the operation is complete
                }
            },
            (error) => {
                this.targetItem = null;
                this.error = "Could not find item, please scan again";
                this.errorDisplayMode = InfoType.Item;
                console.error('Error fetching item details:', error);
                reject(error); // Reject the promise if an error occurs
            }
        );
    });
  }

  async getBorrowerFromBackend(barcode: number): Promise<void> {
    return new Promise((resolve, reject) => {
        this.checkoutService.getBorrower(barcode).subscribe(
            (borrowerDetails) => {
                if (borrowerDetails) {
                    this.targetUser = borrowerDetails[0];
                    console.log("Borrower", this.targetUser);
                    resolve(); // Resolve the promise when the operation is complete
                }
            },
            (error) => {
                this.targetUser = null;
                this.error = "Could not find borrower, please try again";
                this.errorDisplayMode = InfoType.User;
                console.error('Error fetching borrower details:', error);
                reject(error); // Reject the promise if an error occurs
            }
        );
    });
}

async getReservationFromBackend(itemBarcode: number, userBarcode?: number): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!itemBarcode) {
            console.error('Item barcode is required.');
            resolve(); // Resolve the promise immediately since no action is taken
            return;
        }

        if (userBarcode === null || userBarcode === undefined) {
            // No user barcode provided
            this.checkoutService.getUniqueReservation(itemBarcode).subscribe(
                (reservationDetails) => {
                    this.handleReservationDetails(reservationDetails);
                    resolve(); // Resolve the promise when the operation is complete
                },
                (error) => {
                    this.targetReservation = null;
                    console.error('Error fetching reservation details:', error);
                    reject(error); // Reject the promise if an error occurs
                }
            );
        } else {
            // User barcode provided
            this.checkoutService.getNonUniqueReservation(itemBarcode, userBarcode).subscribe(
                (reservationDetails) => {
                    this.handleReservationDetails(reservationDetails);
                    resolve(); // Resolve the promise when the operation is complete
                },
                (error) => {
                    this.targetReservation = null;
                    console.error('Error fetching reservation details:', error);
                    reject(error); // Reject the promise if an error occurs
                }
            );
        }
    });
}

private handleReservationDetails(reservationDetails: any[]): void {
    if (reservationDetails && reservationDetails.length > 0) {
        console.log(reservationDetails);
        this.targetReservation = reservationDetails[0];
        console.log("Reservation", this.targetReservation);
    } else {
        this.targetReservation = null;
    }
  }

  isItemUnique(): boolean | null {
    if (!this.targetItem) {
        return null;
    }

    const itemId = String(this.targetItem.ItemID);

    if (itemId.startsWith('1')) {
        return true; // Unique item
    } else if (itemId.startsWith('9')) {
        return false; // Non-unique item
    } else {
      // Uncomment the line below if you want to consider other cases as unique
      return true; // For any other cases, consider it as unique
      // return null; // If itemId does not start with '1' or '9', return null
    }
  }
}