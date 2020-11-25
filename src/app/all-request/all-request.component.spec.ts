import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRequestComponent } from './all-request.component';

describe('AllRequestComponent', () => {
  let component: AllRequestComponent;
  let fixture: ComponentFixture<AllRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
