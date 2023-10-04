import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateComponent } from './simulate.component';

describe('SimulateComponent', () => {
  let component: SimulateComponent;
  let fixture: ComponentFixture<SimulateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimulateComponent]
    });
    fixture = TestBed.createComponent(SimulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
