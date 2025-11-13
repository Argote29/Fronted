import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Resena } from '../../../models/resena';
import { ServiceResena } from '../../../services/service-resena';


@Component({
  selector: 'app-resenalistar',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './resenalistar.html',
  styleUrl: './resenalistar.css'
})
export class Resenalistar {
dataSource: MatTableDataSource<Resena> = new MatTableDataSource();

  // columnas visibles en la tabla
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  constructor(private rS: ServiceResena) {}

  ngOnInit(): void {
    // carga inicial
    this.rS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    // escucha cambios (insert/update/delete)
    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.rS.delete(id).subscribe(() => {
      this.rS.list().subscribe((data) => this.rS.setList(data));
    });
  }
}
