import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/Item';
@Injectable({
  providedIn: 'root'
})
export class ItemsCrudService {
  
  constructor(private httpClient: HttpClient) { }

  
}
