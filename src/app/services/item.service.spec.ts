// src/app/services/item.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService]
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create an item and return its data', () => {
    const mockItem = {
      ItemID: 1,
      CategoryName: 'Books',
      BarcodeID: 1234567890,
      Name: 'New Item',
      Status: 'Available'
    };
  
    service.createItem(mockItem).subscribe(item => {
      expect(item).toEqual(mockItem);
    });
  
    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockItem);
  });
  
  

  afterEach(() => {
    httpMock.verify();
  });
});
