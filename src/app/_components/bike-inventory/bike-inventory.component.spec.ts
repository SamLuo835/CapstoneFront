import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeInventoryComponent } from './bike-inventory.component';

describe('BikeInventoryComponent', () => {
  let component: BikeInventoryComponent;
  let fixture: ComponentFixture<BikeInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikeInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
