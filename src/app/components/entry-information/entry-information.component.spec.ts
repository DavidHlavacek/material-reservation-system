import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryInformationComponent } from './entry-information.component';

describe('EntryInformationComponent', () => {
  let component: EntryInformationComponent;
  let fixture: ComponentFixture<EntryInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
