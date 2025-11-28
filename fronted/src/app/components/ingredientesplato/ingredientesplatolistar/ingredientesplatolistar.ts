import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Ingredientesplato } from '../../../models/ingredientesplato';
import { ServiceIngredientesplato } from '../../../services/service-ingredientesplato';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-ingredientesplatolistar',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink,CommonModule, MatPaginatorModule],
  templateUrl: './ingredientesplatolistar.html',
  styleUrl: './ingredientesplatolistar.css',
})
export class Ingredientesplatolistar implements OnInit, AfterViewInit {
dataSource: MatTableDataSource<Ingredientesplato> = new MatTableDataSource();
  
    
    displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private rI: ServiceIngredientesplato) {}
  
     ngOnInit(): void {
    // 1. Suscripción reactiva (actualiza la tabla on-the-fly)
    this.rI.getList().subscribe((data) => {
        this.dataSource.data = data; 
        if (this.paginator) { 
            this.dataSource.paginator = this.paginator;
        }
    });
    // 2. Disparador de carga inicial
    this.rI.list().subscribe((data) => {
      this.rI.setList(data); 
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 5;
  }
  
    eliminar(id: number) {
      this.rI.delete(id).subscribe(() => {
        this.rI.list().subscribe((data) => this.rI.setList(data));
      });
    }

}
