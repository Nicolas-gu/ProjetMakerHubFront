import { Unit } from "./units.models";


export interface RecipeIngredientCreateDto{
    name: string;
    baseQuantity?: number | null;
    unit: Unit;
    quantityText?: string | null;
}

export interface RecipeCreateDto {
    title: string;
    description: string;
    basePortion: number;
    prepTime: number;
    cookTime: number;
    isPublic: boolean;
    tagIds: string[];
    steps: string[];
    ingredients: RecipeIngredientCreateDto[];
}

export interface RecipeCreatedResponseDto{
    id: string;
}