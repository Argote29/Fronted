import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ServiceReserva } from '../../services/service-reserva';
import { QueryCantidadDeReservasPorRestauranteDTO } from '../../models/QueryCantidadDeReservasPorRestauranteDTO';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend);


@Component({
  selector: 'app-reportecantidaddereservasporrestaurante',
  imports: [BaseChartDirective, MatIconModule, FormsModule, CommonModule],
  templateUrl: './reportecantidaddereservasporrestaurante.html',
  styleUrl: './reportecantidaddereservasporrestaurante.css',
})
export class Reportecantidaddereservasporrestaurante implements OnInit {

  idRestaurante: number = 1;
  hasData: boolean = false;

  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Cantidad de Reservas por Restaurante' }
    }
  };

  public chartLabels: string[] = ['Reservas'];
  public chartType: ChartType = 'pie';
  public chartLegend = true;

  public chartData: ChartDataset[] = [{
    data: [],
    label: 'Reservas',
    backgroundColor: ['#57FFAE']
  }];

  constructor(private rS: ServiceReserva) {}

  ngOnInit(): void {
    this.cargarGraficoPorRestaurante(this.idRestaurante);
  }

  cargarGraficoPorRestaurante(id: number): void {

    if (!id || id <= 0) {
      alert('Ingrese un ID válido.');
      this.hasData = false;
      return;
    }

    this.rS.getCantidadDeReservaPorRestaurante(id).subscribe({
      next: (data: QueryCantidadDeReservasPorRestauranteDTO) => {

        if (data && data.cantidad_reserva >= 0) {
          this.hasData = true;

          const cantidad = data.cantidad_reserva;

          this.chartData[0].data = [cantidad];

          this.chartLabels = [
            `${data.nombre_restaurante} (${cantidad} reservas)`
          ];

          // Forzar update
          this.chartData = [...this.chartData];

        } else {
          this.hasData = false;
        }
      },

      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.hasData = false;
        alert('Error al obtener datos del servidor.');
      }
    });
  }
}
