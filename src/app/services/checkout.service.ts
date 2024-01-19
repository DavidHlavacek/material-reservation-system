import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getItemStatus(itemId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getItemStatus/${itemId}`);
  }

  checkoutItem(itemId: number, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkoutItem`, { itemId, userId });
  }

  returnItem(itemId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/returnItem`, { itemId });
  }
}
