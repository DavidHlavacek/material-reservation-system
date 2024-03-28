import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { History } from '../models/History';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    private apiUrl = 'http://localhost:3000/api/history';
  
    constructor(private http: HttpClient) {}
  
    getEntries(): Observable<any> {
      return this.http.get(this.apiUrl);
    }
    createEntry(entry: History): Observable<any> {
      console.log('Sending item:', entry); // Add this line
  
      const headers = { 'Content-Type': 'application/json' };
      return this.http.post<any>(this.apiUrl, entry, { headers });
    } 
}