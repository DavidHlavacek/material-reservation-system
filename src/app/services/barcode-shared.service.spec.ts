import { TestBed } from '@angular/core/testing';

import { BarcodeSharedService } from './barcode-shared.service';

describe('BarcodeSharedService', () => {
  let service: BarcodeSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarcodeSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
