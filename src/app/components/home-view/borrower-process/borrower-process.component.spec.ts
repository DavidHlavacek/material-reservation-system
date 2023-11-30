import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerProcessComponent } from './borrower-process.component';

describe('BorrowerProcessComponent', () => {
  let component: BorrowerProcessComponent;
  let fixture: ComponentFixture<BorrowerProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowerProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BorrowerProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
