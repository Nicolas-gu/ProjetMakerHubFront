import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeEdit } from './recipe-edit';

describe('RecipeEdit', () => {
  let component: RecipeEdit;
  let fixture: ComponentFixture<RecipeEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
