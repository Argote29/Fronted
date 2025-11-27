import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Reservalistar } from "./reservalistar/reservalistar";

@Component({
  selector: 'app-reserva',
  imports: [RouterOutlet, Reservalistar],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css',
})
export class Reserva {
constructor(public route:ActivatedRoute) {}

}
