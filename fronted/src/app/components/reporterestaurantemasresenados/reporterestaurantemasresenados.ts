import { Component, OnInit } from '@angular/core';
import {
  ChartDataset,
  ChartOptions,
  ChartType,
} from './../../../../node_modules/chart.js/dist/types/index.d';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { ServiceResena } from '../../services/service-resena';

@Component({
  selector: 'app-reporterestaurantemasresenados',
  imports: [MatIconModule,BaseChartDirective],
  templateUrl: './reporterestaurantemasresenados.html',
  styleUrl: './reporterestaurantemasresenados.css',
  providers: [provideCharts(withDefaultRegisterables())],
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
    this.rS.getRestauranteMasResenados().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels= data.map((item) => item.nombreRestaurante);
        this.barChartData = [
          {
            data: data.map((item) => item.cantidadResenas),
            label: 'Reseñas por Restaurante',
            backgroundColor: ['#57FFAE', '#15664E'],
          },
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}