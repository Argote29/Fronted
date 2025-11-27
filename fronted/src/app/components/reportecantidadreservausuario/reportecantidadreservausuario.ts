import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';

import { ServiceUsuario } from '../../services/service-usuario';

@Component({
  selector: 'app-reportecantidadreservausuario',
  imports: [MatIconModule, BaseChartDirective],
  templateUrl: './reportecantidadreservausuario.html',
  styleUrl: './reportecantidadreservausuario.css',
  providers: [
    provideCharts(withDefaultRegisterables()) 
  ]
})
export class Reportecantidadreservausuario implements OnInit {
  hasData = false;

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private uS: ServiceUsuario) {}

  ngOnInit(): void {
    this.uS.getCantidadReservaUsuario().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.nombre);
        this.barChartData = [
          {
            data: data.map((item) => item.num_reserva),
            label: 'Cantidad de reserva por cliente',
            backgroundColor: [' rgba(255, 255, 255, 1)',' rgba(172, 56, 56, 1)'],
          },
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}
