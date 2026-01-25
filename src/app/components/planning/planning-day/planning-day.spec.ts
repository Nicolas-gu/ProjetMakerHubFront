import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningDay } from './planning-day';

describe('PlanningDay', () => {
  let component: PlanningDay;
  let fixture: ComponentFixture<PlanningDay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningDay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningDay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
