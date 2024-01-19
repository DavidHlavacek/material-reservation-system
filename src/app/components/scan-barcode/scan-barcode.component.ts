import { Component } from '@angular/core';
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
export class ScanBarcodeComponent {
  scanForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.scanForm = this.fb.group({
      itemBarcode: ['', Validators.required],
      userBarcode: ['', Validators.required],
    });
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
}