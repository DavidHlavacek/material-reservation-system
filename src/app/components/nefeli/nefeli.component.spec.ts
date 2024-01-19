import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NefeliComponent } from './nefeli.component';

describe('NefeliComponent', () => {
  let component: NefeliComponent;
  let fixture: ComponentFixture<NefeliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NefeliComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NefeliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
