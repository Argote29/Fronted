import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ServiceUsuario } from '../../services/service-usuario';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { QueryusuarioMasResenadodto } from '../../models/QueryUsuarioMasResenado';

@Component({
  selector: 'app-reporteusuariomasresena',
  imports: [MatIconModule, BaseChartDirective],
  templateUrl: './reporteusuariomasresena.html',
  styleUrl: './reporteusuariomasresena.css',
  providers: [
        provideCharts(withDefaultRegisterables()) 
      ]
})
export class Reporteusuariomasresena {
hasData = false;

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartData: ChartDataset[] = [];

  constructor(private uS: ServiceUsuario) {}

  ngOnInit(): void {
    this.uS.getUsuarioMasResenas().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.nombre);
        this.barChartData = [
          {
            data: data.map((item) => item.totalResenas),
            label: 'Cantidad de resenas por cliente',
            backgroundColor: [' rgba(21, 185, 73, 1)',' rgba(172, 56, 56, 1)'],
          },
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}
