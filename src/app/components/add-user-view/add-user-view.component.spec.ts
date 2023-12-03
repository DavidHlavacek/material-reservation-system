import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserViewComponent } from './add-user-view.component';

describe('AddUserViewComponent', () => {
  let component: AddUserViewComponent;
  let fixture: ComponentFixture<AddUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
