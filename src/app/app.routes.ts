import { Routes } from '@angular/router';
import { Home } from './components/home/home/home';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: "home", component: Home, canActivate: [authGuard]},
    { path: "login", 
        loadComponent: () => import("./components/auth/login/login").then(r => r.Login)
    },
    { path: "new-account", 
        loadComponent: () => import("./components/auth/new-account/new-account").then(r => r.NewAccount)
    },
    { path: "planning", 
        loadComponent: () => import("./components/planning/planning/planning").then(r => r.Planning), canActivate: [authGuard]
    },
    { path: "recipe/favorite", 
        loadComponent: () => import("./components/recipe/favorite/favorite").then(r => r.Favorite), canActivate: [authGuard]
    },
    { path: "recipe/search", 
        loadComponent: () => import("./components/recipe/recipe-search/recipe-search").then(r => r.RecipeSearch), canActivate: [authGuard]
    },
    { path: "recipe/:id", 
        loadComponent: () => import("./components/recipe/recipe-detail/recipe-detail").then(r => r.RecipeDetail), canActivate: [authGuard]
    },
    { path: "recipe/add", 
        loadComponent: () => import("./components/recipe/recipe-add/recipe-add").then(r => r.RecipeAdd), canActivate: [authGuard]
    },
    { path: "ingredient-list", 
        loadComponent: () => import("./components/ingredient/ingredient-list/ingredient-list").then(r => r.IngredientList), canActivate: [authGuard]
    },
    { path: "pantry-item", 
        loadComponent: () => import("./components/ingredient/pantry-items/pantry-items").then(r => r.PantryItems), canActivate: [authGuard]
    },
    { path: "pantry-item/add", 
        loadComponent: () => import("./components/ingredient/pantry-items-add/pantry-items-add").then(r => r.PantryItemsAdd), canActivate: [authGuard]
    },
    { path: "", redirectTo: 'home', pathMatch: 'full' },
];
