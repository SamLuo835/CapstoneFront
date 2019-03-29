import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveRecordComponent } from './active-record.component';

describe('ActiveRecordComponent', () => {
  let component: ActiveRecordComponent;
  let fixture: ComponentFixture<ActiveRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
