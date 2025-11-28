import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Added OnInit, AfterViewInit
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { ServicePlato } from '../../../services/service-plato';
import { Plato } from '../../../models/plato';

@Component({
  selector: 'app-platolistar',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule
  ],
  templateUrl: './platolistar.html',
  styleUrl: './platolistar.css',
})
export class Platolistar implements OnInit, AfterViewInit { 
  dataSource: MatTableDataSource<Plato> = new MatTableDataSource<Plato>();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pS: ServicePlato) {}

  ngOnInit(): void {
    // 1. Suscripción reactiva (actualiza la tabla on-the-fly)
    this.pS.getList().subscribe((data) => {
        this.dataSource.data = data; 
        if (this.paginator) { 
            this.dataSource.paginator = this.paginator;
        }
    });
    // 2. Disparador de carga inicial
    this.pS.list().subscribe((data) => {
      this.pS.setList(data); 
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 5;
  }

  eliminar(id: number): void {
    this.pS.delete(id).subscribe(() => {
      this.pS.list().subscribe(data => {
        this.pS.setList(data);
      });
    });
  }
}