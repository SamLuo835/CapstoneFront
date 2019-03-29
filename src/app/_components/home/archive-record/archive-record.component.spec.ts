import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveRecordComponent } from './archive-record.component';

describe('ArchiveRecordComponent', () => {
  let component: ArchiveRecordComponent;
  let fixture: ComponentFixture<ArchiveRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
