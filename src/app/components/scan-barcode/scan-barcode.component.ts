import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'scan-barcode',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './scan-barcode.component.html',
  styleUrl: './scan-barcode.component.css'
})
export class ScanBarcodeComponent implements AfterViewInit {
  scanForm: FormGroup;

  constructor(private fb: FormBuilder, private renderer: Renderer2, private el: ElementRef) {
    this.scanForm = this.fb.group({
      itemBarcode: ['', Validators.required],
      userBarcode: ['', Validators.required],
    });
  }

  private scannedBarcode: string = '';
  private delayTimer: any;

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
      }, 500);
    }
  }


  isUserBarcodeVisible(): boolean {
    const itemBarcodeControl = this.scanForm.get('itemBarcode');
    return !!itemBarcodeControl && !!itemBarcodeControl.value && itemBarcodeControl.value.startsWith('9');
  }

  ngAfterViewInit(): void {
    this.setFocus('itemBarcode');
  }

  // Helper function to process checkout barcode
  processCheckoutBarcode(): void {
    console.log('Start Checkout Barcode Scanned');
    this.resetForm();
    this.setFocus('itemBarcode');
  }

  // Helper function to process return barcode
  processReturnBarcode(): void {
    console.log('Start Return Barcode Scanned');
    this.resetForm();
    this.setFocus('itemBarcode');
  }

  // Helper function to process item barcode
  processItemBarcode(barcode: string): void {
    console.log('Item Barcode Scanned:', barcode);
    this.scanForm.get('itemBarcode')?.setValue(barcode);
    this.resetForm();
    this.setFocus('userBarcode');
  }

  // Helper function to process user identification barcode
  processUserIdentificationBarcode(barcode: string): void {
    console.log('User Identification Barcode Scanned:', barcode);
    this.scanForm.get('userBarcode')?.setValue(barcode);
  }

  // Helper function to process confirm barcode
  processConfirmBarcode(): void {
    console.log('Submit/Confirm Barcode Scanned');

    // Check if both item and user identification barcodes have been scanned
    const itemBarcodeControl = this.scanForm.get('itemBarcode');
    const userBarcodeControl = this.scanForm.get('userBarcode');

    if (itemBarcodeControl && userBarcodeControl &&
      itemBarcodeControl.value && userBarcodeControl.value) {
      // Perform the necessary logic for confirming the checkout or return
      console.log('Confirmed Checkout/Return');
      this.resetForm();
      this.setFocus('itemBarcode');
    } else {
      console.log('Both Item and User Identification Barcodes must be scanned first');
    }
  }

  // Helper function to process cancel barcode
  processCancelBarcode(): void {
    console.log('Cancel Barcode Scanned');
    this.resetForm();
    this.setFocus('itemBarcode');
  }

  // Main function to handle barcode scanning
  handleBarcodeScanned(barcode: string): void {
    console.log('Scanned Barcode:', barcode);

    if (barcode.startsWith('8900000000121')) {
      this.processCheckoutBarcode();
    } else if (barcode.startsWith('8900000000131')) {
      this.processReturnBarcode();
    } else if (barcode.startsWith('1') || barcode.startsWith('9')) {
      this.processItemBarcode(barcode);
    } else if (barcode.length === 14) {  // Check if it's a 14-digit barcode
      this.processUserIdentificationBarcode(barcode);
    } else if (barcode.startsWith('8900000000777')) {
      this.processConfirmBarcode();
    } else if (barcode.startsWith('8900000000444')) {
      this.processCancelBarcode();
    } else {
      console.log('Invalid Barcode Format');
    }
  }

  private resetForm(): void {
    this.scanForm.patchValue({
      itemBarcode: null,
      userBarcode: null,
      // Add other form controls as needed
    });

    this.scanForm.markAsUntouched();
    this.scanForm.markAsPristine();
  }

  private setFocus(controlName: string): void {
    const element = this.el.nativeElement.querySelector(`#${controlName}`);
    if (element) {
      element.focus();
    }
  }

  handleInput(controlName: string): void {
    const value = this.scanForm.get(controlName)?.value;
    if (value) {
      this.handleBarcodeScanned(value);
    }
  }

  onSubmit(): void {
    const itemBarcode = this.scanForm.get('itemBarcode')?.value;

    if (itemBarcode.startsWith('1')) {
      // Unique barcode logic (retrieve user information, show return option)
      // Example: Call a service method to fetch user information based on itemBarcode
      console.log('Unique Barcode');
    } else if (itemBarcode.startsWith('9')) {
      // Non-unique barcode logic (prompt for user barcode)
      console.log('Non-Unique Barcode');
    } else {
      // Invalid barcode format
      console.log('Invalid Barcode Format');
    }
  }

  submitCheckout(): void {
    // Perform checkout confirmation logic here
    // This is called when the checkout confirmation barcode is scanned
  }
}