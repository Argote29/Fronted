import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { ServiceUsuario } from '../../../services/service-usuario';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LoginService } from '../../../services/login-service'; 
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-usuariolistar',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, MatCardModule, CommonModule, MatPaginatorModule],
  templateUrl: './usuariolistar.component.html',
  styleUrl: './usuariolistar.component.css'
})
export class UsuariolistarComponent implements OnInit, AfterViewInit {
    dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    // Propiedad para almacenar el rol del usuario logueado
    rolesLogueado: any = ''; 

    constructor(
      private uS: ServiceUsuario,
      private loginService: LoginService // ⭐ AÑADIDO: Inyectamos el servicio
    ) {}

    /**
     * Carga el rol del usuario logueado y comprueba si incluye el roleName dado.
     */
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


    ngOnInit(): void {
        this.rolesLogueado = this.loginService.showRole(); // Cargar rol al inicio

        this.uS.getList().subscribe((data) => {
            this.dataSource.data = data; 
            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
            }
        });
        
        this.uS.list().subscribe((data) => {
            this.uS .setList(data);
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

        this.uS.delete(id).subscribe(() => {
            this.uS.list().subscribe(data => {
                this.uS.setList(data)
            });
        });
    }
}
