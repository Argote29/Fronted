import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { UsuariolistarComponent } from './usuariolistar/usuariolistar.component';

@Component({
  selector: 'app-usuario',
  imports: [RouterOutlet,UsuariolistarComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})  
export class UsuarioComponent {
 constructor(public route: ActivatedRoute) {}
}
