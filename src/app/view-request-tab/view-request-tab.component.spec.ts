import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestTabComponent } from './view-request-tab.component';

describe('ViewRequestTabComponent', () => {
  let component: ViewRequestTabComponent;
  let fixture: ComponentFixture<ViewRequestTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
