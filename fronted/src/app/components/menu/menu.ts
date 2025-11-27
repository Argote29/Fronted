import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-menu',
  imports: [MatToolbarModule,MatIconModule,MatButtonModule,MatMenuModule,RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  roles: string = '';
  usuario: string = '';

  constructor(private loginService: LoginService) {}

  cerrar() {
    sessionStorage.clear();
  }
  
 
  verificar() {
    this.roles = this.loginService.showRole();

    return this.loginService.verificar();
  }
  isAdmin() {
    return this.roles === 'ADMIN';
  }

  isTester() {
    return this.roles === 'TESTER';
  }
}
