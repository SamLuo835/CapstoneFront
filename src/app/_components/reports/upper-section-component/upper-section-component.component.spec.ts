import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperSectionComponentComponent } from './upper-section-component.component';

describe('UpperSectionComponentComponent', () => {
  let component: UpperSectionComponentComponent;
  let fixture: ComponentFixture<UpperSectionComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpperSectionComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpperSectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
