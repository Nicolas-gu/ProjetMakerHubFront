import { Routes } from '@angular/router';
import { Home } from './components/home/home/home';

export const routes: Routes = [
    { path: "home", component: Home},
    { path: "login", 
        loadComponent: () => import("./components/auth/login/login").then(r => r.Login)
    },
    { path: "new-account", 
        loadComponent: () => import("./components/auth/new-account/new-account").then(r => r.NewAccount)
    },
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
    { path: "pantry-item", 
        loadComponent: () => import("./components/ingredient/pantry-items/pantry-items").then(r => r.PantryItems)
    },
    { path: "pantry-item/add", 
        loadComponent: () => import("./components/ingredient/pantry-items-add/pantry-items-add").then(r => r.PantryItemsAdd)
    },
    { path: "", redirectTo: 'home', pathMatch: 'full' },
];
