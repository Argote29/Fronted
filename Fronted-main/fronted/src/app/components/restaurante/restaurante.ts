import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Restaurantelistar } from './restaurantelistar/restaurantelistar';

@Component({
  selector: 'app-restaurante',
  imports: [RouterOutlet,Restaurantelistar],
  templateUrl: './restaurante.html',
  styleUrl: './restaurante.css',
})
export class Restaurante {
    constructor(public route:ActivatedRoute) {}

}
