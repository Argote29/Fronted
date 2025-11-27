  import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
  // Eliminamos MatTableDataSource ya que no se usa para paginación/filtrado aquí
  import { Restaurante } from '../../../models/Restaurante';
  import { RestauranteService } from '../../../services/service-restaurante';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { RouterLink } from '@angular/router';
  import { MatCardModule } from '@angular/material/card';
  import { CommonModule } from '@angular/common'; // Necesario para @for, @empty, y otros
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

  @Component({
    selector: 'app-restaurantelistar',
    imports: [MatButtonModule, MatIconModule, RouterLink, MatCardModule, CommonModule,MatPaginatorModule], // Añadir CommonModule
    templateUrl: './restaurantelistar.html',
    styleUrl: './restaurantelistar.css',
  })
  export class Restaurantelistar implements OnInit, AfterViewInit {
    dataSource: MatTableDataSource <Restaurante> = new MatTableDataSource<Restaurante>([]);
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private rS: RestauranteService) {}

      ngOnInit(): void {
        this.rS.getList().subscribe((data) => {
            this.dataSource.data = data; 
            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
            }
        });
        
        this.rS.list().subscribe((data) => {
            this.rS .setList(data);
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageSize = 3;
    }
    
    eliminar(id: number) {
      this.rS.delete(id).subscribe(() => {
        this.rS.list().subscribe(data => {
          this.rS.setList(data)
        });
      });
    }
  }