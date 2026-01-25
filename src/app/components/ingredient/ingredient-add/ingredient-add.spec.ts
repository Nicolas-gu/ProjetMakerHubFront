import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientAdd } from './ingredient-add';

describe('IngredientAdd', () => {
  let component: IngredientAdd;
  let fixture: ComponentFixture<IngredientAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
