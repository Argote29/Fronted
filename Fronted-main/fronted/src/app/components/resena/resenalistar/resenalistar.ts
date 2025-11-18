import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ServiceResena } from '../../../services/service-resena';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Resena } from '../../../models/resena';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';



@Component({
  selector: 'app-resenalistar',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink,MatPaginatorModule],
  templateUrl: './resenalistar.html',
  styleUrl: './resenalistar.css'
})
export class Resenalistar {
 dataSource: MatTableDataSource<Resena> = new MatTableDataSource();

  
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  @ViewChild(MatPaginator) paginator!: MatPaginator; //Paginator

  constructor(private rS: ServiceResena) {}

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
