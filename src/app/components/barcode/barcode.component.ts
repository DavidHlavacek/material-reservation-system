import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxBarcode6Module } from 'ngx-barcode6';


@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, NgxBarcode6Module],
  templateUrl: './barcode.component.html',
  styleUrl: './barcode.component.css'
})
export class BarcodeComponent {
  date!: Date;
  yrs!: string;
  lotlot:any;
  @ViewChild('dayOfTheYear') dayOfTheYear!: ElementRef;
  isChecked:any;

  constructor(private renderer: Renderer2) {

  }

  get barcodeValue() {
    var timestmp = new Date().setFullYear(new Date().getFullYear(), 0, 1);     
    var yearFirstDay = Math.floor(timestmp / 86400000);      
    var today = Math.ceil((new Date().getTime()) / 86400000);
    var dayOfYear = today - yearFirstDay; 
  
    const dt = new Date();
    this.date = dt;
    const year_time = dt.getFullYear();

    if (year_time === 2018 ) {
      this.yrs = '8';
    }

    if (year_time === 2019 ) {
      this.yrs = '9';
    }
    if (year_time === 2020 ) {
      this.yrs = '0';
    }

    if (year_time === 2021 ) {
      this.yrs = '1';
    }
    if (year_time === 2022 ) {
      this.yrs = '2';
    }
    return (this.isChecked ? 'L' : '') + this.yrs+dayOfYear;
  }

  ngAfterViewInit() {
    var timestmp = new Date().setFullYear(new Date().getFullYear(), 0, 1);     
    var yearFirstDay = Math.floor(timestmp / 86400000);      
    var today = Math.ceil((new Date().getTime()) / 86400000);
    var dayOfYear = today - yearFirstDay; 
  
    const dt = new Date();
    this.date = dt;
    const year_time = dt.getFullYear();

    if (year_time === 2018 ) {
      this.yrs = '8';
    }

    if (year_time === 2019 ) {
      this.yrs = '9';
    }
    if (year_time === 2020 ) {
      this.yrs = '0';
    }

    if (year_time === 2021 ) {
      this.yrs = '1';
    }
    if (year_time === 2022 ) {
      this.yrs = '2';
    }
    this.renderer.setProperty(this.dayOfTheYear.nativeElement, 'innerHTML', this.yrs+dayOfYear, ) ;
    this.dayOfTheYear=this.lotlot;
  }
}
