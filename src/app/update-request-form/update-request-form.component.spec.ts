import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRequestFormComponent } from './update-request-form.component';

describe('UpdateRequestFormComponent', () => {
  let component: UpdateRequestFormComponent;
  let fixture: ComponentFixture<UpdateRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
