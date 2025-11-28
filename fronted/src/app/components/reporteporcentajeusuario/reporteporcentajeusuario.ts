import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ServiceUsuario } from '../../services/service-usuario';

import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { QueryPorcentajeUsuarioFiltrado } from '../../models/QueryPorcentajeUsuarioFiltradoDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporteporcentajeusuario',
  imports: [BaseChartDirective,MatIconModule,FormsModule,CommonModule],
  templateUrl: './reporteporcentajeusuario.html',
  styleUrl: './reporteporcentajeusuario.css',
  providers: [provideCharts(withDefaultRegisterables())],

})
export class Reporteporcentajeusuario implements OnInit {
  
  // 🎯 Variable de Filtro del Usuario
  generoSeleccionado: string = 'F'; 

  hasData = false;

  // 💡 Configuración del Gráfico de Pastel (Pie Chart)
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Proporción del Género Seleccionado vs. Total' }
    }
  };
  
  public chartLabels: string[] = ['Género Seleccionado', 'Otros Géneros'];
  public chartType: ChartType = 'pie'; // 🎯 Cambiado de 'line' a 'pie'
  public chartLegend = true;
  
  public chartData: ChartDataset[] = [{
    data: [],
    label: 'Porcentaje de Usuarios',
    backgroundColor: ['#57FFAE', '#15664E'] // Colores
  }];

  constructor(private uS: ServiceUsuario) {}

  ngOnInit(): void {
    // Carga un valor por defecto al iniciar
    this.cargarGraficoPorGenero(this.generoSeleccionado);
  }

  // 🎯 Método para cargar y actualizar el gráfico
  cargarGraficoPorGenero(genero: string): void {
    // 💡 Validación básica antes de llamar al servicio
    if (!genero || (genero.toUpperCase() !== 'M' && genero.toUpperCase() !== 'F')) {
      alert('Por favor, ingrese un género válido (M o F).');
      this.hasData = false;
      return;
    }
    
    // 1. Llamada al servicio, que devuelve un ÚNICO DTO
    this.uS.getPorcentajeUsuariosPorGenero(genero).subscribe({
      next: (data: QueryPorcentajeUsuarioFiltrado) => {
        // Verifica que el resultado sea válido y tenga el porcentaje
        if (data && data.porcentaje !== undefined && data.porcentaje >= 0) {
          this.hasData = true;
          const porcentajeSeleccionado = data.porcentaje;
          const porcentajeRestante = 100 - porcentajeSeleccionado;
          
          // 2. Mapear los datos al formato del gráfico de pastel (dos segmentos)
          this.chartData[0].data = [porcentajeSeleccionado, porcentajeRestante];
          
          // 3. Actualizar etiquetas dinámicamente
          this.chartLabels = [`${genero.toUpperCase()} (${porcentajeSeleccionado.toFixed(2)}%)`, 'Otros Géneros'];
          
          // 💡 Forzar la actualización del gráfico
          this.chartData = [...this.chartData]; 
          
        } else {
          this.hasData = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.hasData = false;
        alert('Error al obtener los datos. Verifique el servidor.');
      }
    });
  }
}