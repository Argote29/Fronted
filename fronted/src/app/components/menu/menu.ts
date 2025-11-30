import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-menu',
  standalone: true, 
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit { 
  roles: any = ''; 
  userEmail: string | null = null; 
    
  // NUEVA PROPIEDAD: Para almacenar el ID numérico que viene del Backend
  userIdNumerico: number | null = null; 

  constructor(private loginService: LoginService) {}
  
  ngOnInit(): void {
    // 1. Cargamos el rol
    this.roles = this.loginService.showRole(); 
    
    // 2. Obtenemos el identificador (que sabemos que es el correo)
    const identifier = this.loginService.showIdUser(); 

    // Asignamos el identificador al correo si es una cadena
    if (typeof identifier === 'string') {
        this.userEmail = identifier;
        
        // 3. LLAMADA AL BACKEND: Si tenemos el correo, buscamos el ID numérico
        this.loginService.fetchUserIdByEmail(this.userEmail).subscribe({
            next: (id: number) => {
                // El ID numérico se guarda aquí
                this.userIdNumerico = id;
                console.log('DEBUG: ID obtenido del Backend:', this.userIdNumerico);
            },
            error: (err) => {
                // Manejar error si el Backend devuelve 404 o 401
                console.error('Error al obtener ID numérico:', err);
                this.userIdNumerico = null;
            }
        });
    }

    console.log('DEBUG: Rol cargado en MenuComponent:', this.roles);
    console.log('DEBUG: Correo de Usuario cargado en MenuComponent:', this.userEmail);
  }

  cerrar() {
    sessionStorage.clear();
  }
  
  verificar(): boolean {
    return this.loginService.verificar();
  }
  
  // FUNCIÓN CENTRAL PARA VERIFICAR EL ROL (Solución robusta para Arrays y Cadenas)
  private hasRole(roleName: string): boolean {
    if (!this.roles) return false;

    // Si es un Array (ej: ['ROLE_ADMIN']), buscamos la palabra clave en cada elemento.
    if (Array.isArray(this.roles)) {
        const expectedRole = roleName.toLowerCase();
        
        return this.roles.some((roleElement: string) => {
            // Buscamos 'admin' dentro de 'ROLE_ADMIN'
            return roleElement && roleElement.toLowerCase().includes(expectedRole);
        });
    }

 
    if (typeof this.roles === 'string') {
        const normalizedRole = this.roles.toLowerCase();
        const expectedRole = roleName.toLowerCase();
        
        return normalizedRole.includes(expectedRole);
    }
    
    return false;
  }

 
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isClient(): boolean {
    return this.hasRole('CLIENT');
  }

  isRestaurant(): boolean {
    return this.hasRole('RESTAURANT');
  }
}