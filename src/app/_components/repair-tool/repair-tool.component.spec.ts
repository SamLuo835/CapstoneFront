import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairToolComponent } from './repair-tool.component';

describe('RepairToolComponent', () => {
  let component: RepairToolComponent;
  let fixture: ComponentFixture<RepairToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
