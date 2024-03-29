import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  public apiUrl = "http://localhost:3000/api"; 

  constructor(private http: HttpClient) {}

  checkEmailExistence(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-email?email=${email}`);
  }

  registerEmail(email: string, name: string, barcode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, name, barcode });
  }
}
