import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ServicePromociones } from '../../../services/service-promociones';
import { Promociones } from '../../../models/promociones';

@Component({
  selector: 'app-promocioneslistar',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './promocioneslistar.html',
  styleUrl: './promocioneslistar.css',
})
export class Promocioneslistar {
 dataSource: MatTableDataSource<Promociones> = new MatTableDataSource();

   displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  constructor(private proS: ServicePromociones) {}
  ngOnInit(): void {
    
    this.proS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    
    this.proS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.proS.delete(id).subscribe(() => {
      this.proS.list().subscribe((data) => this.proS.setList(data));
    });
  }
}
