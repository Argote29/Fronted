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
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink,MatPaginatorModule,CommonModule],
  templateUrl: './resenalistar.html',
  styleUrl: './resenalistar.css'
})
export class Resenalistar {
 dataSource: MatTableDataSource<Resena> = new MatTableDataSource();

  
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private rS: ServiceResena) {}

  ngOnInit(): void {
    this.rS.getList().subscribe((data) => {
        this.dataSource.data = data; 
        if (this.paginator) { 
            this.dataSource.paginator = this.paginator;
        }
    });
    this.rS.list().subscribe((data) => {
      this.rS.setList(data); 
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 5;
  }

  eliminar(id: number) {
    this.rS.delete(id).subscribe(() => {
      this.rS.list().subscribe((data) => this.rS.setList(data));
    });
  }
}
