import { Routes } from '@angular/router';
import { Home } from './components/home/home/home';

export const routes: Routes = [
    { path: "home", component: Home},
    { path: "planning", 
        loadComponent: () => import("./components/planning/planning/planning").then(r => r.Planning)
    },
    { path: "favorite", 
        loadComponent: () => import("./components/recipe/favorite/favorite").then(r => r.Favorite)
    },
    { path: "recipe", 
        loadComponent: () => import("./components/recipe/recipe-list/recipe-list").then(r => r.RecipeList)
    },
    { path: "recipe-add", 
        loadComponent: () => import("./components/recipe/recipe-add/recipe-add").then(r => r.RecipeAdd)
    },
    { path: "ingredient-list", 
        loadComponent: () => import("./components/ingredient/ingredient-list/ingredient-list").then(r => r.IngredientList)
    },
    { path: "ingredient-add", 
        loadComponent: () => import("./components/ingredient/ingredient-add/ingredient-add").then(r => r.IngredientAdd)
    },
    { path: "", redirectTo: 'home', pathMatch: 'full' },
];
