import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Historiallistar } from "./historiallistar/historiallistar";

@Component({
  selector: 'app-historial',
  imports: [RouterOutlet, Historiallistar],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial {
 constructor(public route: ActivatedRoute) {}

}
