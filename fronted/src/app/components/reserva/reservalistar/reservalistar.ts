import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../../models/Reserva';
import { ServiceReserva } from '../../../services/service-reserva';

@Component({
  selector: 'app-reservalistar',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink,MatPaginatorModule],
  templateUrl: './reservalistar.html',
  styleUrl: './reservalistar.css',
})
export class Reservalistar {
  dataSource: MatTableDataSource<Reserva> = new MatTableDataSource();

  
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8','c9'];
  @ViewChild(MatPaginator) paginator!: MatPaginator; //Paginator

  constructor(private rS: ServiceReserva) {}

  ngOnInit(): void {
    
    this.rS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    
    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  
  this.rS.list().subscribe(data => {
    this.dataSource.data = data;
    this.dataSource.paginator = this.paginator;
  });
}

  eliminar(id: number) {
    this.rS.delete(id).subscribe(() => {
      this.rS.list().subscribe((data) => this.rS.setList(data));
    });
  }
}
