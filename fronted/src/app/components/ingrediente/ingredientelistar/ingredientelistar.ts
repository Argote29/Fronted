import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Ingrediente } from '../../../models/ingrediente';
import { ServiceIngrediente } from '../../../services/service-ingrediente';


@Component({
  selector: 'app-ingredientelistar',
  imports: [MatTableModule,MatButtonModule,MatIconModule,RouterLink],
  templateUrl: './ingredientelistar.html',
  styleUrl: './ingredientelistar.css',
})
export class Ingredientelistar implements OnInit {
dataSource: MatTableDataSource<Ingrediente> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3','c4','c5','c6','c7','c8','c9'];
  
  constructor(private iG: ServiceIngrediente) {}

  ngOnInit(): void {
    this.iG.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.iG.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.iG.delete(id).subscribe((data) => {
      this.iG.list().subscribe(data=>{
        this.iG.setList(data)
      })
    });
  }
}
