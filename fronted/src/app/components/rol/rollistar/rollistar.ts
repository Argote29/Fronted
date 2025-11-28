import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // 👈 Importar AfterViewInit
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Rol } from '../../../models/rol';
import { RolService } from '../../../services/service-rol';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-rollistar',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, MatCardModule, CommonModule, MatPaginatorModule],
  templateUrl: './rollistar.html',
  styleUrl: './rollistar.css',
})
export class Rollistar implements OnInit, AfterViewInit { // 👈 Implementar AfterViewInit
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3','c7','c8'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: RolService) {}

  
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
    this.dataSource.paginator.pageSize = 2;
  }

    
  eliminar(id: number) {
    this.rS.delete(id).subscribe(() => {
      // Recargar la lista y usar setList para notificar a getList()
      this.rS.list().subscribe(data => {
        this.rS.setList(data)
      });
    });
  }
}