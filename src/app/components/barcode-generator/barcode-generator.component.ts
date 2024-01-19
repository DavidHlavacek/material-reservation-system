import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';

//import { AppComponent } from '../../app.component';

import { NgxBarcode6Module } from 'ngx-barcode6';
import { BrowserModule } from '@angular/platform-browser';
//import {} from '@angular/animations';
//import {} from '@angular/cdk';
import { FormsModule } from '@angular/forms';//import {} from '@angular/material';
//import {} from '@angular/platform-browser';
//import {} from '@angular/platform-browser-dynamic';
//import {} from '@angular/router';
// import 'core-js/actual';
import { CommonModule } from '@angular/common';
import { BarcodeGeneratorService } from '../../services/barcode-shared.service';
//import {} from 'rxjs';


@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxBarcode6Module],
  providers: [BarcodeGeneratorService],
  templateUrl: './barcode-generator.component.html',
  styleUrls: ['./barcode-generator.component.css'],
})
export class BarcodeGeneratorComponent {
  date: Date = new Date(); // Assign a default value to date
  yrs: string = ''; // Assign a default value to yrs
  isChecked: boolean = false; // Property to track checkbox state
  inputString: string = ''; // New property to store user-entered string
  barcodeValue: string = ''; // Property to store the generated barcode
  PrintSerials: any[] = []; // Property for PrintSerials array
  uniqueIdentifierKey = "902324522"

  @ViewChild('dayOfTheYear') dayOfTheYear!: ElementRef; // Use "!" to tell TypeScript that it will be initialized later

  constructor(private renderer: Renderer2, private barcodeGeneratorService: BarcodeGeneratorService) {
    // Initialize PrintSerials with sample data or load it from a service
    this.PrintSerials = [
      { SerialId: '12345' },
      { SerialId: '67890' },
      // ... other objects
    ];
  } 

  ngAfterViewInit() {
    const dayOfYear = this.calculateDayOfYear();
    this.renderer.setProperty(
      this.dayOfTheYear.nativeElement,
      'innerHTML',
      this.yrs + dayOfYear
    );
  }

  private calculateDayOfYear(): number {
    const timestmp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
    const yearFirstDay = Math.floor(timestmp / 86400000);
    const today = Math.ceil(new Date().getTime() / 86400000);
    return today - yearFirstDay;
  }

  // New method to handle input changes and update barcode
  updateBarcode() {
    // Recalculate barcode value when input changes
    // This method is bound to the (input) event of the input field
    this.generateBarcodeValue();
  }

  // Updated method to generate barcode on submit button click
  generateBarcode() {
    // Generate the barcode and update the view
    return this.generateBarcodeValue();
  }

  private generateBarcodeValue() {
   // Use the service to generate barcode value
   return this.barcodeGeneratorService.generateBarcodeValue(this.inputString);
  }
}