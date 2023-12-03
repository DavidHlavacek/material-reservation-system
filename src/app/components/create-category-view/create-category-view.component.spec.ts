import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryViewComponent } from './create-category-view.component';

describe('CreateCategoryViewComponent', () => {
  let component: CreateCategoryViewComponent;
  let fixture: ComponentFixture<CreateCategoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCategoryViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
