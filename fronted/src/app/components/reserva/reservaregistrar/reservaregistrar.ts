import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Usuario } from '../../../models/usuario';
import { Restaurante } from '../../../models/Restaurante';
import { Reserva } from '../../../models/Reserva';

import { ServiceUsuario } from '../../../services/service-usuario';
import { RestauranteService } from '../../../services/service-restaurante';
import { ServiceReserva } from '../../../services/service-reserva';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-reservaregistrar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerToggle
  ],
  templateUrl: './reservaregistrar.html',
  styleUrl: './reservaregistrar.css'
})
export class Reservaregistrar {
  form: FormGroup = new FormGroup({});
  r: Reserva = new Reserva();

  edicion = false;
  id = 0;

  listaUsuarios: Usuario[] = [];
  listaRestaurantes: Restaurante[] = [];

  minDate: Date = new Date();

  constructor(
    private rs: ServiceReserva,
    private us: ServiceUsuario,
    private restS: RestauranteService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}
  

  ngOnInit(): void {
    this.route.params.subscribe((p: Params) => {
      this.id = p['id'];
      this.edicion = this.id != null;
      this.init();
    });

    this.us.list().subscribe(data => (this.listaUsuarios = data));
    this.restS.list().subscribe(data => (this.listaRestaurantes = data));

    this.form = this.fb.group({
      id: [''],

      fecha_reserva: [
        '',
        Validators.compose([
          Validators.required,
          (control) => {
            const fecha: Date = control.value;
            if (!fecha) return null;

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            fecha.setHours(0, 0, 0, 0);

            return fecha < hoy ? { fechaInvalida: true } : null;
          }
        ])
      ],

      hora: [
        '',
        Validators.compose([
          Validators.required,
          (control) => {
            const hora = control.value;
            if (!hora) return null;

            const [h] = hora.split(':').map(Number);
            return h < 11 || h > 20 ? { horaInvalida: true } : null;
          }
        ])
      ],

      numero_personas: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ],

      estado: [
        { value: 'Pendiente', disabled: !this.edicion }, // ← REGISTRO: bloqueado / EDICIÓN: editable
        Validators.required
      ],

      usuarioId: [null, Validators.required],
      restauranteId: [null, Validators.required],
    });
  }

  aceptar(): void {
    if (!this.form.valid) return;

    const raw = this.form.getRawValue();

    // Convertir Date → "YYYY-MM-DD"
    let fechaFormateada = "";
    if (raw.fecha_reserva instanceof Date) {
      fechaFormateada = raw.fecha_reserva.toISOString().split("T")[0];
    } else {
      fechaFormateada = raw.fecha_reserva;
    }

    this.r.id_reserva = raw.id;
    this.r.fecha_reserva = fechaFormateada as any;
    this.r.hora = raw.hora;
    this.r.numero_personas = raw.numero_personas;
    this.r.estado = raw.estado;
    this.r.usuario.id_usuario = raw.usuarioId;
    this.r.restaurante.id_restaurante = raw.restauranteId;

    const operacion = this.edicion ? this.rs.update(this.r) : this.rs.insert(this.r);

    operacion.subscribe(() => {
      this.rs.list().subscribe(data => this.rs.setList(data));
      this.router.navigate(['/reserva']);
    });
  }

  init(): void {
    if (this.edicion) {
      this.rs.listId(this.id).subscribe(data => {
        this.r = data;

        this.form = new FormGroup({
          id: new FormControl(data.id_reserva),

          fecha_reserva: new FormControl(
            new Date(data.fecha_reserva),
            Validators.required
          ),

          hora: new FormControl(data.hora, Validators.required),

          numero_personas: new FormControl(
            data.numero_personas,
            [Validators.required, Validators.min(1), Validators.max(5)]
          ),

          estado: new FormControl(
            data.estado, 
            Validators.required
          ), // ← en edición debe ser editable

          usuarioId: new FormControl(data.usuario?.id_usuario, Validators.required),
          restauranteId: new FormControl(data.restaurante?.id_restaurante, Validators.required),
        });
      });
    }
  }

  volverAPadre() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
