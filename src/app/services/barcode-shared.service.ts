// barcode-generator.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BarcodeGeneratorService {
  
  generateBarcodeValue(inputString: string): string {
    // Combine Unix time with string length and update the barcode value
    const unixTime = Math.floor(new Date().getTime() / 1000);
    const barcodeValue = `${unixTime}${inputString.length}`;

    // Log or use the barcodeValue as needed
    console.log('Generated Barcode:', barcodeValue);

    return barcodeValue;
  }
}
