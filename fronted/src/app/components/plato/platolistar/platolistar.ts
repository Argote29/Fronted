import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Added OnInit, AfterViewInit
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { ServicePlato } from '../../../services/service-plato';
import { Plato } from '../../../models/plato';
import { LoginService } from '../../../services/login-service';

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
baseColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']; // Columnas de datos
  // Inicialmente vacío, se llenará en ngOnInit
  displayedColumns: string[] = []; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  rolesLogueado: any = ''; 
  constructor(private pS: ServicePlato,private loginService: LoginService) {}

 private hasRole(roleName: string): boolean {
      // Aseguramos que el rol del usuario logueado esté cargado
      this.rolesLogueado = this.loginService.showRole() || null; 

      if (!this.rolesLogueado) return false;

      const expectedRole = roleName.toLowerCase();
      
      let rolesToCheck: string[] = [];
      
      if (Array.isArray(this.rolesLogueado)) {
          rolesToCheck = this.rolesLogueado;
      } else if (typeof this.rolesLogueado === 'string') {
          rolesToCheck = [this.rolesLogueado]; 
      } else {
          return false;
      }

      return rolesToCheck.some((roleElement: string) => {
          return roleElement && roleElement.toLowerCase().includes(expectedRole);
      });
    }

    /** Retorna true si el usuario logueado es CLIENTE. */
    isClient(): boolean {
      return this.hasRole('CLIENT');
    }
     /** Retorna true si el usuario logueado es ADMINISTRADOR. */
    isAdmin(): boolean {
      return this.hasRole('ADMIN');
    }
  ngOnInit(): void {
    // 1. Cargar el rol
    const isClientRole = this.isClient();
    const isAdminRole = this.isAdmin();


    // 2. Definir las columnas a mostrar CONDICIONALMENTE
    this.displayedColumns = [...this.baseColumns]; // Agrega ID, Comentario, Calificación, etc.
    
    // Si NO es cliente (es decir, ADMIN o RESTAURANT), agregamos las columnas de acción isAdminRole !isClientRole
    if (isAdminRole ) {
        this.displayedColumns.push('c7', 'c8'); // c7: Actualizar, c8: Eliminar
    }
    
    // 3. Cargar datos
    this.pS.getList().subscribe((data) => {
        this.dataSource.data = data; 
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }
    });
    
    this.pS.list().subscribe((data) => {
        this.pS.setList(data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 5;
  }

  eliminar(id: number) {
    // ⭐ El bloqueo en el TS es vital si ocultamos los botones en el HTML
    if (this.isClient()) {
        console.warn('Acción de eliminación no permitida para el rol CLIENTE');
        return; 
    }

    this.pS.delete(id).subscribe(() => {
        this.pS.list().subscribe(data => {
            this.pS.setList(data);
        });
    });
  }
}