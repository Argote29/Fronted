import { Component } from '@angular/core';
import { Ingredientelistar } from "./ingredientelistar/ingredientelistar";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ingrediente',
  imports: [Ingredientelistar,RouterOutlet],
  templateUrl: './ingrediente.html',
  styleUrl: './ingrediente.css',
})
export class Ingrediente {
 constructor(public route: ActivatedRoute) {}
}
