import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftRequestComponent } from './draft-request.component';

describe('DraftRequestComponent', () => {
  let component: DraftRequestComponent;
  let fixture: ComponentFixture<DraftRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
