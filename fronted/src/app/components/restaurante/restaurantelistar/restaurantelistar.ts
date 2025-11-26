import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Restaurante } from '../../../models/Restaurante';
import { RestauranteService } from '../../../services/service-restaurante';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-restaurantelistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink,MatCardModule],
  templateUrl: './restaurantelistar.html',
  styleUrl: './restaurantelistar.css',
})
export class Restaurantelistar implements OnInit {
  dataSource: Restaurante[] = [];


    constructor(private rS: RestauranteService) {}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      this.dataSource = data;
    });
    this.rS.getList().subscribe((data) => {
      this.dataSource = data;
    });
  }
  eliminar(id: number) {
    this.rS.delete(id).subscribe((data) => {
      this.rS.list().subscribe(data=>{
        this.rS.setList(data)
      })
    });
  }
}
