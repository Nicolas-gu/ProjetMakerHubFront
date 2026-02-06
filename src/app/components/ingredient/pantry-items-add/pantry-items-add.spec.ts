import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryItemsAdd } from './pantry-items-add';

describe('PantryItemsAdd', () => {
  let component: PantryItemsAdd;
  let fixture: ComponentFixture<PantryItemsAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantryItemsAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantryItemsAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
