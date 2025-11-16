import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Ingredientesplato } from '../../../models/ingredientesplato';
import { ServiceIngredientesplato } from '../../../services/service-ingredientesplato';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ingredientesplatolistar',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink,CommonModule],
  templateUrl: './ingredientesplatolistar.html',
  styleUrl: './ingredientesplatolistar.css',
})
export class Ingredientesplatolistar {
dataSource: MatTableDataSource<Ingredientesplato> = new MatTableDataSource();
  
    
    displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  
    constructor(private rI: ServiceIngredientesplato) {}
  
    ngOnInit(): void {
      
      this.rI.list().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      });
      
      this.rI.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      });
    }
  
    eliminar(id: number) {
      this.rI.delete(id).subscribe(() => {
        this.rI.list().subscribe((data) => this.rI.setList(data));
      });
    }

}
