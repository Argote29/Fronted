import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core'; // Añadir OnInit y AfterViewInit
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ServiceResena } from '../../../services/service-resena';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Resena } from '../../../models/resena';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LoginService } from '../../../services/login-service';


@Component({
  selector: 'app-resenalistar',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink,MatPaginatorModule,CommonModule],
  templateUrl: './resenalistar.html',
  styleUrl: './resenalistar.css'
})
export class Resenalistar implements OnInit, AfterViewInit { // Implementar interfaces
  dataSource: MatTableDataSource<Resena> = new MatTableDataSource();

  // Definimos las columnas base y de acción
  baseColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']; // Columnas de datos
  // Inicialmente vacío, se llenará en ngOnInit
  displayedColumns: string[] = []; 
  
  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  rolesLogueado: any = ''; 

  constructor(private rS: ServiceResena, private loginService: LoginService) {}

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
    const isAdminRole = this.isAdmin();

    // 2. Definir las columnas a mostrar CONDICIONALMENTE
    this.displayedColumns = [...this.baseColumns]; // Agrega ID, Comentario, Calificación, etc.
    
    // ⭐ CAMBIO: Solo si es ADMIN, agregamos las columnas de acción.
    if (isAdminRole) {
        this.displayedColumns.push('c7', 'c8'); // c7: Actualizar, c8: Eliminar
    }
    
    // 3. Cargar datos
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
    // ⭐ CAMBIO: Bloqueamos si NO es ADMIN. Esto bloquea CLIENTE y RESTAURANT.
    if (!this.isAdmin()) {
        console.warn('Acción de eliminación no permitida. Solo para ADMINISTRADORES.');
        return; 
    }

    this.rS.delete(id).subscribe(() => {
        this.rS.list().subscribe(data => {
            this.rS.setList(data);
        });
    });
  }
}