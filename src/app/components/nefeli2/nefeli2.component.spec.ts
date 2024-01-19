import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nefeli2Component } from './nefeli2.component';

describe('Nefeli2Component', () => {
  let component: Nefeli2Component;
  let fixture: ComponentFixture<Nefeli2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nefeli2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Nefeli2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
