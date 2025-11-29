<<<<<<< HEAD
  import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
  // Eliminamos MatTableDataSource ya que no se usa para paginación/filtrado aquí
  import { Restaurante } from '../../../models/Restaurante';
  import { RestauranteService } from '../../../services/service-restaurante';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { RouterLink } from '@angular/router';
  import { MatCardModule } from '@angular/material/card';
  import { CommonModule } from '@angular/common'; // Necesario para @for, @empty, y otros
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

  @Component({
    selector: 'app-restaurantelistar',
    imports: [MatButtonModule, MatIconModule, RouterLink, MatCardModule, CommonModule,MatPaginatorModule], // Añadir CommonModule
    templateUrl: './restaurantelistar.html',
    styleUrl: './restaurantelistar.css',
  })
  export class Restaurantelistar implements OnInit, AfterViewInit {
    dataSource: MatTableDataSource <Restaurante> = new MatTableDataSource<Restaurante>([]);
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private rS: RestauranteService) {}

      ngOnInit(): void {
        this.rS.getList().subscribe((data) => {
            this.dataSource.data = data; 
            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
            }
        });
        
        this.rS.list().subscribe((data) => {
            this.rS .setList(data);
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageSize = 3;
    }
    
    eliminar(id: number) {
      this.rS.delete(id).subscribe(() => {
        this.rS.list().subscribe(data => {
          this.rS.setList(data)
        });
      });
    }
  }
=======
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Restaurante } from '../../../models/Restaurante';
import { RestauranteService } from '../../../services/service-restaurante';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LoginService } from '../../../services/login-service'; // ⭐ IMPORTAR LoginService

@Component({
    selector: 'app-restaurantelistar',
    standalone: true, // Añadido para consistencia si estás usando Angular moderno
    imports: [MatButtonModule, MatIconModule, RouterLink, MatCardModule, CommonModule, MatPaginatorModule],
    templateUrl: './restaurantelistar.html',
    styleUrl: './restaurantelistar.css',
})
export class Restaurantelistar implements OnInit, AfterViewInit {
    dataSource: MatTableDataSource <Restaurante> = new MatTableDataSource<Restaurante>([]);
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    rolesLogueado: any = ''; // Para almacenar el rol del usuario

    constructor(
        private rS: RestauranteService,
        private loginService: LoginService // ⭐ INYECTAR LoginService
    ) {}

  
    private hasRole(roleName: string): boolean {
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

    /** Retorna true si el usuario logueado es ADMINISTRADOR. */
    isAdmin(): boolean {
        return this.hasRole('ADMIN');
    }
    // ----------------------------------------------------

    ngOnInit(): void {
        this.rolesLogueado = this.loginService.showRole(); // Cargar rol al inicio

        this.rS.getList().subscribe((data) => {
            this.dataSource.data = data; 
            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
            }
        });
        
        this.rS.list().subscribe((data) => {
            this.rS .setList(data);
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageSize = 3;
    }
    
    eliminar(id: number) {
        // ⭐ Protección adicional en TS
        if (!this.isAdmin()) {
            console.warn('Acción no permitida: Solo el administrador puede eliminar.');
            return;
        }

        this.rS.delete(id).subscribe(() => {
            this.rS.list().subscribe(data => {
                this.rS.setList(data)
            });
        });
    }
}
>>>>>>> 32923653bc662f1f1a7ddaa62e58baf03e92454d
