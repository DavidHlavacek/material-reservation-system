import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  private apiUrl = 'http://localhost:3000/api/';
  getItemStatus() {

  }
  getReservationWithUniqueItem() {

  }
  getReservationWithCommonItem() {
    
  }
  checkoutItem() {

  }
  returnItem() {

  }
}