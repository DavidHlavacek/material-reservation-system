import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { CheckoutService } from '../../services/checkout.service';
import { Observable, map } from 'rxjs';
import { HistoryService } from '../../services/history.service';
import { History } from '../../models/History';
import { firstValueFrom } from 'rxjs';


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

    if (barcode.startsWith("8900000000444")) { // Cancel operation
      this.cancelAll();
      this.resetForm();
      return;
    }

    if (this.expectedBarcode === InfoType.Item) {
      await this.processItemBarcode(barcode);
    } else if (this.expectedBarcode === InfoType.User) {
      await this.processUserBarcode(barcode);
    } else if (this.expectedBarcode === InfoType.Command) {
      await this.processCommandBarcode(barcode);
    }

    this.resetForm();
  }

  async processItemBarcode(barcode: string): Promise<void> {
    try {
      const itemResponse = await firstValueFrom(this.checkoutService.getItemByBarcode(parseInt(barcode)));
      this.targetItem = itemResponse ? itemResponse[0] : null;
      if (!this.targetItem) throw new Error('Item not found');

      const reservationResponse = await firstValueFrom(this.checkoutService.getReservationByItemId(this.targetItem.ItemID));
      this.targetReservation = reservationResponse && reservationResponse.length > 0 ? reservationResponse[0] : null;

      // Determine next steps based on item and reservation status
      if (this.targetReservation && this.targetItem.Status === 'Issued') {
        // Setup for return process
        this.isCheckout = false;
        this.expectedBarcode = InfoType.Command; // Skip user barcode for returns
        this.userInstruction = "Confirm return with command barcode";
      } else {
        // Setup for checkout process
        this.isCheckout = true;
        this.expectedBarcode = InfoType.User;
        this.userInstruction = "Scan borrower barcode";
      }
    } catch (error) {
      console.error('Error processing item barcode:', error);
      this.error = "Could not process item, please try again";
      this.errorDisplayMode = InfoType.Item;
    }
  }

  // Continuing from your ScanBarcodeComponent...

  async processUserBarcode(barcode: string): Promise<void> {
    // Assuming barcode is the User ID for simplicity.
    // In a real application, you might need to fetch user details based on the scanned barcode.
    this.targetUser = { UserID: barcode }; // Simplified assumption
    this.expectedBarcode = InfoType.Command; // Next, expect a command barcode to confirm action.
    this.userInstruction = "Scan command barcode to confirm checkout";
  }

  async processCommandBarcode(barcode: string): Promise<void> {
    if (barcode === '8900000000777') { // Assuming this barcode means "confirm action"
      if (this.isCheckout) {
        await this.checkoutItem();
      } else {
        await this.returnItem();
      }
    } else {
      this.error = "Invalid command barcode. Please try again.";
      this.errorDisplayMode = InfoType.Command;
    }
  }

  async checkoutItem(): Promise<void> {
    if (!this.targetItem || !this.targetUser) {
      this.error = "Missing item or user information for checkout.";
      this.errorDisplayMode = InfoType.Item; // Just a generic error display mode
      return;
    }

    // Assuming targetItem.ItemID and targetUser.UserID hold the necessary IDs
    this.checkoutService.checkoutItem(this.targetItem.ItemID, this.targetUser.UserID).subscribe({
      next: () => {
        this.processStatus = "Item checked out successfully.";
        this.pageReset(); // Reset the scanning process after successful checkout
      },
      error: (err) => {
        this.error = "Failed to checkout item. Please try again.";
        console.error(err);
      }
    });
  }

  async returnItem(): Promise<void> {
    if (!this.targetItem) {
      this.error = "Missing item information for return.";
      this.errorDisplayMode = InfoType.Item; // Just a generic error display mode
      return;
    }

    // Assuming targetItem.ItemID holds the necessary ID
    this.checkoutService.returnItem(this.targetItem.ItemID).subscribe({
      next: () => {
        this.processStatus = "Item returned successfully.";
        this.pageReset(); // Reset the scanning process after successful return
      },
      error: (err) => {
        this.error = "Failed to return item. Please try again.";
        console.error(err);
      }
    });
  }

  // Utility method to reset the state after checkout or return
  pageReset(): void {
    this.scanForm.reset();
    this.setFocus('barcode');
    this.targetItem = null;
    this.targetUser = null;
    this.targetReservation = null;
    this.isCheckout = null;
    this.userInstruction = "Scan item barcode to begin";
    this.expectedBarcode = InfoType.Item;
    this.processStatus = "";
    this.error = "";
  }


  cancelAll(): void {
    this.processStatus = "Cancelled current process";
    this.pageReset();
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