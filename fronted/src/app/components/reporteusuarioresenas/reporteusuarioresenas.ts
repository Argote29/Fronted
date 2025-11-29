import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ServiceUsuario } from '../../services/service-usuario';
import { QueryUsuarioResenas } from '../../models/QueryUsuarioResenas';

@Component({
  selector: 'app-reporteusuarioresenas',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './reporteusuarioresenas.html',
  styleUrls: ['./reporteusuarioresenas.css'],
})
export class Reporteusuarioresenas implements OnInit {
  hasData = false;
  usuariosResenas: QueryUsuarioResenas[] = [];

  constructor(private sI: ServiceUsuario) {}

  ngOnInit(): void {
    // Traer todos los usuarios con su cantidad de reseñas
    this.sI.getUsuarioResenas().subscribe((data: QueryUsuarioResenas[]) => {
      const arr = Array.isArray(data) ? data : [data];

      // Si quieres, puedes filtrar para mostrar solo usuarios con al menos una reseña
      this.usuariosResenas = arr.map(item => {
        const u = new QueryUsuarioResenas();
        u.nombre = item.nombre ?? '';
        u.totalResenas = item.totalResenas ?? 0;
        return u;
      });

      this.hasData = this.usuariosResenas.length > 0;
    });
  }
}
