import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBorrowerViewComponent } from './add-borrower-view.component';

describe('AddBorrowerViewComponent', () => {
  let component: AddBorrowerViewComponent;
  let fixture: ComponentFixture<AddBorrowerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBorrowerViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBorrowerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
