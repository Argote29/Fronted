import { Component, OnInit } from "@angular/core";

import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { RestauranteService } from "../../services/service-restaurante";
import { CommonModule } from "@angular/common";
import { QueryRestaurantesMasVariedadPlatosDTO } from "../../models/QueryRestaurantesMasVariedadPlatosDTO";


@Component({
  selector: 'app-reporterestaurantemasvariedaddeplatos',
   imports: [
    CommonModule,
    MatTableModule 
  ],
  templateUrl: './reporterestaurantemasvariedaddeplatos.html',
  styleUrls: ['./reporterestaurantemasvariedaddeplatos.css']
})
export class RestaurantesMasVariedadPlatosComponent implements OnInit {

   displayedColumns: string[] = ['nombreRestaurante', 'totalPlatos'];

  dataSource = new MatTableDataSource<QueryRestaurantesMasVariedadPlatosDTO>();

  constructor(private restauranteService: RestauranteService) {}

  ngOnInit(): void {
    this.restauranteService
      .getRestaurantesMasVariedadPlatos()
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }
}