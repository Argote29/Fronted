import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Promocioneslistar } from './promocioneslistar/promocioneslistar';

@Component({
  selector: 'app-promociones',
  imports: [RouterOutlet,Promocioneslistar],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css',
})
export class Promociones {
constructor(public route:ActivatedRoute) {}
}
