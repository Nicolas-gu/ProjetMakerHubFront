import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-pantry-items',
  imports: [RouterLink, MatIconModule],
  templateUrl: './pantry-items.html',
  styleUrl: './pantry-items.css',
})
export class PantryItems {

}
