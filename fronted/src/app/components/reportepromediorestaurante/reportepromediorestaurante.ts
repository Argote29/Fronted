import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { RestauranteService } from '../../services/service-restaurante';

@Component({
  selector: 'app-reportepromediorestaurante',
  imports: [MatIconModule, BaseChartDirective],
  templateUrl: './reportepromediorestaurante.html',
  styleUrl: './reportepromediorestaurante.css',
  providers: [
    provideCharts(withDefaultRegisterables()) 
  ]
})
export class Reportepromediorestaurante implements OnInit {
  hasData = false;

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private uS: RestauranteService) {}

  ngOnInit(): void {
    this.uS.getPromedioRestaurante().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.nombre);
        this.barChartData = [
          {
            data: data.map((item) => item.promCalificacion),
            label: 'Promedio del restaurante',
            backgroundColor: [
              ' rgba(21, 185, 73, 1)',
              ' rgba(197, 167, 69, 1)',
            ],
          },
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}
