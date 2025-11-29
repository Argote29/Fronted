import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-menu',
<<<<<<< HEAD
  standalone: true,
=======
  standalone: true, 
>>>>>>> 32923653bc662f1f1a7ddaa62e58baf03e92454d
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
<<<<<<< HEAD
export class Menu implements OnInit {
  // Usamos 'any' para el rol ya que el formato de retorno es un Array inesperado (ej: ['ROLE_ADMIN'])
  roles: any = '';
=======
export class Menu implements OnInit { 
  // Usamos 'any' para el rol ya que el formato de retorno es un Array inesperado (ej: ['ROLE_ADMIN'])
  roles: any = ''; 
>>>>>>> 32923653bc662f1f1a7ddaa62e58baf03e92454d
  usuario: string = '';

  constructor(private loginService: LoginService) {}
  
  ngOnInit(): void {
    // 1. Cargamos el rol al inicio del componente para que esté listo al renderizar el HTML.
<<<<<<< HEAD
    this.roles = this.loginService.showRole();
=======
    this.roles = this.loginService.showRole(); 
>>>>>>> 32923653bc662f1f1a7ddaa62e58baf03e92454d
    console.log('DEBUG: Rol cargado en MenuComponent:', this.roles);
  }

  cerrar() {
    sessionStorage.clear();
  }
  
  verificar(): boolean {
    // 2. Solo verifica el estado de la sesión. El rol ya fue cargado en ngOnInit.
    return this.loginService.verificar();
  }
  
  // 🔒 FUNCIÓN CENTRAL PARA VERIFICAR EL ROL (Solución robusta para Arrays y Cadenas)
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

    // Si es una cadena (el formato original simple esperado).
    if (typeof this.roles === 'string') {
        const normalizedRole = this.roles.toLowerCase();
        const expectedRole = roleName.toLowerCase();
        
        return normalizedRole.includes(expectedRole);
    }
    
    return false;
  }

  // 🛑 MÉTODOS DE ROL (Usan la lógica de hasRole)
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