import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReqComponent } from './view-req.component';

describe('ViewReqComponent', () => {
  let component: ViewReqComponent;
  let fixture: ComponentFixture<ViewReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
