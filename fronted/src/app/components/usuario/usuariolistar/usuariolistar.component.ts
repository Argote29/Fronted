import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { ServiceUsuario } from '../../../services/service-usuario';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuariolistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink,MatCardModule,CommonModule],
  templateUrl: './usuariolistar.component.html',
  styleUrl: './usuariolistar.component.css'
})
export class UsuariolistarComponent {
dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns: string[] = [
  'c1', 'c3', 'c4', 'c5', 'c6',
  'c7', 'c8', 'c10', 'c11', 'c12'
];
  constructor(private uS: ServiceUsuario) {}
   ngOnInit(): void {
    this.uS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.uS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.uS.delete(id).subscribe((data) => {
      this.uS.list().subscribe(data=>{
        this.uS.setList(data)
      })
    });
  }
}
