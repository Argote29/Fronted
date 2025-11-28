import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RestauranteService } from '../../services/service-restaurante';

@Component({
  selector: 'app-reporterestaurantessinpromo',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './reporterestaurantessinpromo.html',
  styleUrl: './reporterestaurantessinpromo.css',
})
export class Reporterestaurantessinpromo implements OnInit {
  hasData = false;
  restaurantesSinPromo: { nombre_restaurante: string; totalPromociones: number }[] = [];

  constructor(private uS: RestauranteService) {}

  ngOnInit(): void {
    this.uS.getRestaurantesSinPromos().subscribe((data) => {
      // Por si acaso filtramos los que realmente tienen 0 promos
      this.restaurantesSinPromo = data.filter(r => r.totalPromociones === 0);

      this.hasData = this.restaurantesSinPromo.length > 0;
    });
  }
}
