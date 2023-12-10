import { TestBed } from '@angular/core/testing';

import { ItemsCrudService } from './items-crud.service';

describe('ItemsCrudService', () => {
  let service: ItemsCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
