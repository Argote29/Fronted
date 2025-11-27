import { Component, OnInit } from '@angular/core';
import {
  ChartDataset,
  ChartOptions,
  ChartType,
} from './../../../../node_modules/chart.js/dist/types/index.d';
import { ServiceResena } from '../../services/service-resena';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reporterestaurantemasresenados',
  imports: [MatIconModule,BaseChartDirective],
  templateUrl: './reporterestaurantemasresenados.html',
  styleUrl: './reporterestaurantemasresenados.css',
})
export class Reporterestaurantemasresenados implements OnInit {
  hasData = false;

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private rS: ServiceResena) {}

  ngOnInit(): void {
    this.rS.getreporte1().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels= data.map((item) => item.nombreRestaurante);
        this.barChartData = [
          {
            data: data.map((item) => item.cantidadResenas),
            label: 'Restaurantes mas Reseñados',
            backgroundColor: [
              ' rgb(242, 94, 35)',
              ' rgb(238, 122, 75)'
              ],
          },
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}