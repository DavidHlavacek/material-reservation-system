import { Injectable } from '@angular/core';
import { SHA256 } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class BarcodeGeneratorService {
  generateBarcodeValue(inputString: string): string {
    // Combine Unix time, a random value, and string length for better randomness
    const unixTimeMillis = new Date().getTime(); // Use milliseconds for higher precision
    const cryptoRandom = new Uint32Array(1);
    window.crypto.getRandomValues(cryptoRandom);
    const randomValue = cryptoRandom[0];

    const combinedValue = `${unixTimeMillis}${randomValue}${inputString.length}`;

    // Use SHA-256 hash to get a fixed-size output
    const hashedValue = SHA256(combinedValue).toString();

    // Extract only digits from the hashed value
    const digitsOnly = hashedValue.replace(/\D/g, '');

    // Take the first 12 digits
    const barcodeValue = digitsOnly.slice(0, 12);

    // Log or use the barcodeValue as needed
    console.log('Generated Barcode:', barcodeValue);

    return barcodeValue;
  }
}
