// barcode-generator.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Declare bwipjs as any to avoid TypeScript issues
declare var bwipjs: any;

@Component({
  selector: 'app-barcode-generator',
  templateUrl: './barcode-generator.component.html',
  styleUrls: ['./barcode-generator.component.css'],
})
export class BarcodeGeneratorComponent implements OnInit {
  @ViewChild('emailInput', { static: true }) emailInput!: ElementRef;

  barcodeData: string = '';

  ngOnInit() {
    // Initialize bwip-js
    bwipjs('canvas', {}, () => {});
  }

  generateBarcode() {
    const emailInputValue = this.emailInput.nativeElement.value;

    if (emailInputValue) {
      const enteredStringLength = emailInputValue.length;
      const unixTime = Math.floor(new Date().getTime() / 1000);

      // Concatenate email length and Unix time to create barcode data
      this.barcodeData = enteredStringLength.toString() + unixTime.toString();

      // Call the function to generate barcode using 'bwip-js'
      bwipjs('mycanvas', {
        bcid: 'code128',       // Barcode type
        text: this.barcodeData, // Text to encode
        scale: 3,              // 3x scaling factor
        height: 10,            // Bar height, in millimeters
      });
    } else {
      console.error('Email input is empty.');
    }
  }
}
