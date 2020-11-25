import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartRepresentComponent } from './chart-represent.component';

describe('ChartRepresentComponent', () => {
  let component: ChartRepresentComponent;
  let fixture: ComponentFixture<ChartRepresentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartRepresentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartRepresentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
