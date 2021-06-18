import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpoceDetailsComponent } from './spoce-details.component';

describe('SpoceDetailsComponent', () => {
  let component: SpoceDetailsComponent;
  let fixture: ComponentFixture<SpoceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpoceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpoceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
