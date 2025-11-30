import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { ServiceHistorial } from '../../services/service-historial';
import { QuerySuscripcionActiva } from '../../models/QuerySuscripcionActiva';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-reportesuscripcionactiva',
  imports: [MatIconModule, BaseChartDirective],
  templateUrl: './reportesuscripcionactiva.html',
  styleUrl: './reportesuscripcionactiva.css',
  providers: [
      provideCharts(withDefaultRegisterables()) 
    ]
})
export class ReportesuscripcionactivaComponent {
 hasData = false;

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = ['Vigentes por fecha', 'Vencidas por fecha']; 
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private historialService: ServiceHistorial) {}

  ngOnInit(): void {
    this.historialService.getComparacionSuscripciones().subscribe((data: QuerySuscripcionActiva) => {
      if (data) {
        this.hasData = true;

        this.barChartData = [
          {
            data: [data.activos, data.inactivos], 
            label: 'Estado de Suscripciones por fecha de vencimiento',
            backgroundColor: [
              'rgba(57, 201, 105, 1)',  
              'rgb(204, 0, 0)'    
            ],
          },
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}
