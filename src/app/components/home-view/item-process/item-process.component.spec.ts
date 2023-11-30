import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemProcessComponent } from './item-process.component';

describe('ItemProcessComponent', () => {
  let component: ItemProcessComponent;
  let fixture: ComponentFixture<ItemProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
