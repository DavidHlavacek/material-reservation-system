import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemViewComponent } from './create-category-dialog.component';

describe('CreateItemViewComponent', () => {
  let component: CreateItemViewComponent;
  let fixture: ComponentFixture<CreateItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItemViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
