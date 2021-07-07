import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelReqComponent } from './cancel-req.component';

describe('CancelReqComponent', () => {
  let component: CancelReqComponent;
  let fixture: ComponentFixture<CancelReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
