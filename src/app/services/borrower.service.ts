import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BorrowerService {
  private apiUrl = 'http://localhost:3000/api/borrowers'; // Update the URL according to your backend

  constructor(private httpClient: HttpClient) {}

  getBorrowerEmail(borrowerName: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/${borrowerName}`);
  }
}
