import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerSectionComponentComponent } from './lower-section-component.component';

describe('LowerSectionComponentComponent', () => {
  let component: LowerSectionComponentComponent;
  let fixture: ComponentFixture<LowerSectionComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerSectionComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerSectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
