import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Resenalistar } from './resenalistar/resenalistar';

@Component({
  selector: 'app-resena',
  imports: [RouterOutlet,Resenalistar],
  templateUrl: './resena.html',
  styleUrl: './resena.css'
})
export class Resena {
constructor(public route:ActivatedRoute) {}
}
