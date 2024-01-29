import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/api'; // Update the URL according to your backend

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log(email, password);
    return this.http.post(`${this.apiUrl}/login`, {email: email, password: password});
  }
}


