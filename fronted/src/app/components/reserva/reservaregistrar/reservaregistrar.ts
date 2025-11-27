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

@Component({
  selector: 'app-reservaregistrar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
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

    this.us.list().subscribe(d => (this.listaUsuarios = d));
    this.restS.list().subscribe(d => (this.listaRestaurantes = d));

    
    this.form = this.fb.group({
      id: [''],
      fecha_reserva: ['', Validators.required],
      hora: ['', Validators.required],
      numero_personas: [1, [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required],
      usuarioId: [null, Validators.required],
      restauranteId: [null, Validators.required],
    });
  }

  aceptar(): void {
    if (!this.form.valid) return;

    this.r.id_reserva = this.form.value.id;
    this.r.fecha_reserva = this.form.value.fecha_reserva;
    this.r.hora = this.form.value.hora;
    this.r.numero_personas = this.form.value.numero_personas;
    this.r.estado = this.form.value.estado;
    this.r.usuario.id_usuario = this.form.value.usuarioId;
    this.r.restaurante.id_restaurante = this.form.value.restauranteId;

    const op = this.edicion ? this.rs.update(this.r) : this.rs.insert(this.r);

    op.subscribe(() => {
      this.rs.list().subscribe(data => this.rs.setList(data));
      this.router.navigate(['/reserva']);
    });
  }

  private init(): void {
    if (this.edicion) {
      this.rs.listId(this.id).subscribe(data => {
        this.r.fecha_reserva = data.fecha_reserva;

        this.form = new FormGroup({
          id: new FormControl(data.id_reserva),
          fecha_reserva: new FormControl(data.fecha_reserva, Validators.required),
          hora: new FormControl(data.hora, Validators.required),
          numero_personas: new FormControl(data.numero_personas, [Validators.required, Validators.min(1)]),
          estado: new FormControl(data.estado, Validators.required),
          usuarioId: new FormControl(data.usuario?.id_usuario, Validators.required),
          restauranteId: new FormControl(data.restaurante?.id_restaurante, Validators.required),
        });
      });
    }
  }
}