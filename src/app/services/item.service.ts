import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/Item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  public apiUrl = 'http://localhost:3000/api/items'; // Update the URL according to your backend

  constructor(private http: HttpClient) {}

  getItems(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createItem(item: Item): Observable<any> {
    console.log('Sending item:', item); // Add this line

    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(this.apiUrl, item, { headers });
  }
}


