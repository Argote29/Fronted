import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { ServicePlato } from '../../../services/service-plato';
import { Plato } from '../../../models/plato';

@Component({
  selector: 'app-platolistar',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './platolistar.html',
  styleUrl: './platolistar.css',
})
export class Platolistar {

dataSource: MatTableDataSource<Plato> = new MatTableDataSource();
displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
constructor(private pS: ServicePlato) {}



ngOnInit(): void {
  // carga inicial
  this.pS.list().subscribe((data) => {
    this.dataSource = new MatTableDataSource(data);
  });
  // escucha cambios (insert/update/delete)
  this.pS.getList().subscribe((data) => {
    this.dataSource = new MatTableDataSource(data);
  });
}

eliminar(id: number) {
  this.pS.delete(id).subscribe(() => {
    this.pS.list().subscribe((data) => this.pS.setList(data));
  });
}
}
