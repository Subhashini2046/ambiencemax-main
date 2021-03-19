import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRequestPdfComponent } from './export-request-pdf.component';

describe('ExportRequestPdfComponent', () => {
  let component: ExportRequestPdfComponent;
  let fixture: ComponentFixture<ExportRequestPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportRequestPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRequestPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
