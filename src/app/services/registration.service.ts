import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  checkEmailExistence(email: string): Observable<any> {
    return this.http.get(`/api/check-email?email=${email}`);
  }

  registerEmail(email: string, barcode: number): Observable<any> {
    return this.http.post('/api/register', { email, barcode });
  }
}
