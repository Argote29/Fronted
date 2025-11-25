import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Historial } from '../../../models/historial';
import { ServiceHistorial } from '../../../services/service-historial';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historiallistar',
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './historiallistar.html',
  styleUrl: './historiallistar.css',
})
export class Historiallistar {
dataSource: MatTableDataSource<Historial> = new MatTableDataSource();
  displayedColumns: string[] = [
  'c1', 'c2', 'c3', 'c4', 'c5',
  'c6', 'c7'
];
constructor(private hS: ServiceHistorial) {}
   ngOnInit(): void {
    this.hS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.hS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.hS.delete(id).subscribe((data) => {
      this.hS.list().subscribe(data=>{
        this.hS.setList(data)
      })
    });
  }
}
