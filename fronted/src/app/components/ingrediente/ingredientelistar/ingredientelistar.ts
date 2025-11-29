import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Ingrediente } from '../../../models/ingrediente';
import { ServiceIngrediente } from '../../../services/service-ingrediente';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-ingredientelistar',
  imports: [MatTableModule,MatButtonModule,MatIconModule,RouterLink,CommonModule,MatPaginatorModule],
  templateUrl: './ingredientelistar.html',
  styleUrl: './ingredientelistar.css',
})
export class Ingredientelistar implements OnInit, AfterViewInit {
dataSource: MatTableDataSource<Ingrediente> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3','c4','c5','c6','c7','c8','c9'];
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private iG: ServiceIngrediente) {}

  ngOnInit(): void {

    this.iG.getList().subscribe((data) => {
        this.dataSource.data = data; 
        if (this.paginator) { 
            this.dataSource.paginator = this.paginator;
        }
    });
    this.iG.list().subscribe((data) => {
      this.iG.setList(data); 
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 5;
  }

  eliminar(id: number) {
    this.iG.delete(id).subscribe((data) => {
      this.iG.list().subscribe(data=>{
        this.iG.setList(data)
      })
    });
  }
}
