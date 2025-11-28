import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';

import { ServicePromociones } from '../../../services/service-promociones';
import { Promociones } from '../../../models/promociones';

@Component({
  selector: 'app-promocioneslistar',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    MatSliderModule
  ],
  templateUrl: './promocioneslistar.html',
  styleUrl: './promocioneslistar.css',
})
export class Promocioneslistar {
  dataSource: MatTableDataSource<Promociones> = new MatTableDataSource<Promociones>();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private proS: ServicePromociones) {}

  ngOnInit(): void {
    this.proS.getList().subscribe((data) => {
        this.dataSource.data = data; 
        if (this.paginator) { 
            this.dataSource.paginator = this.paginator;
        }
    });
    this.proS.list().subscribe((data) => {
      this.proS.setList(data); 
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 5;
  }

  eliminar(id: number): void {
    this.proS.delete(id).subscribe(() => {
      this.proS.list().subscribe(data => this.proS.setList(data));
    });
  }
}