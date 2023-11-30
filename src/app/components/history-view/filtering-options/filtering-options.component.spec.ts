import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteringOptionsComponent } from './filtering-options.component';

describe('FilteringOptionsComponent', () => {
  let component: FilteringOptionsComponent;
  let fixture: ComponentFixture<FilteringOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteringOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilteringOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
