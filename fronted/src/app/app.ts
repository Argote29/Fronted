import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Menu } from "./components/menu/menu";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common'; // Importar si usas *ngIf, no necesario para @if

@Component({
  selector: 'app-root',
  standalone: true, // Asegúrate de que sea standalone si usas imports directos
  imports: [CommonModule, RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showMenu = true;
  protected readonly title = signal('fronted');
  
  constructor(private router: Router) {
    // Escuchar cambios de ruta para ocultar el menú en '/'
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Ocultar menú si la ruta es '/' (Landing) o '/login'
      this.showMenu = event.url !== '/' && event.url !== '/login';
    });
  }
}