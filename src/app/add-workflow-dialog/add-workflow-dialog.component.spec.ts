import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowDialogComponent } from './add-workflow-dialog.component';

describe('AddWorkflowDialogComponent', () => {
  let component: AddWorkflowDialogComponent;
  let fixture: ComponentFixture<AddWorkflowDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkflowDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkflowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
