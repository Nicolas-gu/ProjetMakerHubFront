import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryItems } from './pantry-items';

describe('PantryItems', () => {
  let component: PantryItems;
  let fixture: ComponentFixture<PantryItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantryItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantryItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
