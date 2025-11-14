import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Platolistar } from './platolistar/platolistar';


@Component({
  selector: 'app-plato',
  imports: [RouterOutlet,Platolistar],
  templateUrl: './plato.html',
  styleUrl: './plato.css',
})
export class Plato {
  constructor(
    public route:ActivatedRoute
  ) {}
}
