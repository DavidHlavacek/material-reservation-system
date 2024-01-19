import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categories'; // Update the URL according to your backend

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createCategory(category: Category): Observable<any> {
    console.log('Sending item:', category); // Add this line

    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(this.apiUrl, category, { headers });
  }
  deleteCategory(categoryName: string): Observable<any> {
    console.log('Sending request to delete category:', categoryName);

    const headers = { 'Content-Type': 'application/json' };
    const url = `${this.apiUrl}/${encodeURIComponent(categoryName)}`;
    console.log(url);
    
    return this.http.delete<any>(url, { headers: headers });
  }
}


