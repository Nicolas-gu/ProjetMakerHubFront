import { Routes } from '@angular/router';
import { Home } from './components/home/home/home';

export const routes: Routes = [
    { path: "home", component: Home},
    { path: "recipe", 
        loadComponent: () => import("./components/recipe/recipe-list/recipe-list").then(r => r.RecipeList)
    },
    { path: "recipe-add", 
        loadComponent: () => import("./components/recipe/recipe-add/recipe-add").then(r => r.RecipeAdd)
    },
    { path: "", redirectTo: 'home', pathMatch: 'full' },
];
