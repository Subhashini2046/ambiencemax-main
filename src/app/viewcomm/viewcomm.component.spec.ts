import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcommComponent } from './viewcomm.component';

describe('ViewcommComponent', () => {
  let component: ViewcommComponent;
  let fixture: ComponentFixture<ViewcommComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcommComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcommComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
