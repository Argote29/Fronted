import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ServiceIngrediente } from '../../services/service-ingrediente';

@Component({
  selector: 'app-reporteingredientesplatopororigen',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './reporteingredientesplatopororigen.html',
  styleUrl: './reporteingredientesplatopororigen.css',
})
export class Reporteingredientesplatopororigen implements OnInit {
  hasData = false;
  searchTerm: string = '';
  ingredientes: any[] = [];

  constructor(private sI: ServiceIngrediente) {}

  ngOnInit(): void {}

  buscar(): void {
  const origen = this.searchTerm.trim();

  if (!origen) {
    this.hasData = false;
    this.ingredientes = [];
    return;
  }

  this.sI.getIngredientespororigen(origen).subscribe((data: any) => {
    const arr = Array.isArray(data) ? data : [data];

    if (arr.length === 0) {
      this.hasData = false;
      this.ingredientes = [];
      return;
    }

    this.hasData = true;

    // 🔹 Convertimos ["Brócoli","Vegetal"] a { nombre: "Brócoli", origen: "Vegetal" }
    this.ingredientes = arr.map((item: any) => {
      if (Array.isArray(item)) {
        return {
          nombre: item[0],
          origen: item[1],
        };
      } else {
        // por si después el backend devuelve objetos
        return {
          nombre: item.nombre_ingrediente ?? item.nombre ?? '',
          origen: item.origen ?? '',
        };
      }
    });
  });
}
}
