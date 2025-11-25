import { Component } from '@angular/core';
import { Ingredientesplatolistar } from './ingredientesplatolistar/ingredientesplatolistar';
import { ActivatedRoute, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-ingredientesplato',
  imports: [RouterOutlet, Ingredientesplatolistar,],
  templateUrl: './ingredientesplato.html',
  styleUrl: './ingredientesplato.css',
})
export class Ingredientesplato {

constructor(public route: ActivatedRoute) {}

}
