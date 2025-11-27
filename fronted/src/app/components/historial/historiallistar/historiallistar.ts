import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Historial } from '../../../models/historial';
import { ServiceHistorial } from '../../../services/service-historial';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-historiallistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, CommonModule,MatPaginatorModule],
  templateUrl: './historiallistar.html',
  styleUrl: './historiallistar.css',
})
export class Historiallistar implements OnInit, AfterViewInit {
dataSource: MatTableDataSource<Historial> = new MatTableDataSource();
  displayedColumns: string[] = [
  'c1', 'c2', 'c3', 'c4', 'c5',
  'c6', 'c7'
];
   
@ViewChild(MatPaginator) paginator!: MatPaginator;

constructor(private hS: ServiceHistorial) {}
    ngOnInit(): void {
    this.hS.getList().subscribe((data) => {
        this.dataSource.data = data; 
        if (this.paginator) { 
            this.dataSource.paginator = this.paginator;
        }
    });
    this.hS.list().subscribe((data) => {
      this.hS.setList(data); 
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 5;
  }

  eliminar(id: number) {
    this.hS.delete(id).subscribe((data) => {
      this.hS.list().subscribe(data=>{
        this.hS.setList(data)
      })
    });
  }
}
