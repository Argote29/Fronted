  import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Añadir OnInit y AfterViewInit
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Importar MatTableDataSource
  import { RouterLink } from '@angular/router';
  import { Usuario } from '../../../models/usuario';
  import { ServiceUsuario } from '../../../services/service-usuario';
  import { MatCardModule } from '@angular/material/card';
  import { CommonModule } from '@angular/common';
  import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Importar MatPaginatorModule

  @Component({
    selector: 'app-usuariolistar',
    standalone: true, // Asumo standalone por la propiedad 'imports'
    imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, MatCardModule, CommonModule, MatPaginatorModule], // Añadir MatPaginatorModule
    templateUrl: './usuariolistar.component.html',
    styleUrl: './usuariolistar.component.css'
  })
  // Implementar las interfaces necesarias
  export class UsuariolistarComponent implements OnInit, AfterViewInit {
      dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>([]);

      @ViewChild(MatPaginator) paginator!: MatPaginator;

      constructor(private uS: ServiceUsuario) {}

      ngOnInit(): void {
          this.uS.getList().subscribe((data) => {
              this.dataSource.data = data; 
              if (this.paginator) {
                  this.dataSource.paginator = this.paginator;
              }
          });
          
          this.uS.list().subscribe((data) => {
              this.uS.setList(data);
          });
      }

      ngAfterViewInit(): void {
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.pageSize = 3;
      }

      eliminar(id: number) {
          this.uS.delete(id).subscribe(() => {
              this.uS.list().subscribe(data => {
                  this.uS.setList(data);
              });
          });
      }
  }