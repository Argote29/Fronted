import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { ServicePlato } from '../../../services/service-plato';
import { RestauranteService } from '../../../services/service-restaurante';
import { ServicePromociones } from '../../../services/service-promociones';

import { Restaurante } from '../../../models/Restaurante';
import { Plato } from '../../../models/plato';
import { Promociones } from '../../../models/promociones';

@Component({
  selector: 'app-platoregistrar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './platoregistrar.html',
  styleUrl: './platoregistrar.css',
})
export class Platoregistrar {
  form: FormGroup = new FormGroup({});
  r: Plato = new Plato();
  edicion = false;
  id = 0;
  listaRestaurantes: Restaurante[] = [];
  listaPromociones: Promociones[] = [];

  constructor(
    private ps: ServicePlato,
    private rs: RestauranteService,
    private promS: ServicePromociones,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}
  volverAPadre() {
  this.router.navigate(['../'], { relativeTo: this.route });
}

  ngOnInit(): void {

    this.route.params.subscribe((p: Params) => {
      this.id = p['id'];
      this.edicion = this.id != null;
      this.init();
    });
    this.promS.list().subscribe(d => (this.listaPromociones = d));
    this.rs.list().subscribe(d => (this.listaRestaurantes = d));
    this.form = this.fb.group({
      id_plato: [''],
      precio_plato: [0, [Validators.required,Validators.min(1), Validators.max(10000)]],
      nombre_plato: ["", Validators.required],
      info_nutricional: ["",[Validators.required, Validators.maxLength(200)]],
      id_promociones: [null, Validators.required],
      id_restaurante: [null, Validators.required],
    });
  }

  aceptar(): void {
    if (!this.form.valid) return;
    this.r.id_plato = this.form.value.id_plato;
    this.r.precio_plato = this.form.value.precio_plato;
    this.r.nombre_plato = this.form.value.nombre_plato;
    this.r.info_nutricional = this.form.value.info_nutricional;
    this.r.promociones = new Promociones();
    this.r.restaurante = new Restaurante();
    this.r.promociones.id_Promociones = this.form.value.id_promociones;
    this.r.restaurante.id_restaurante = this.form.value.id_restaurante;
    const op = this.edicion ? this.ps.update(this.r) : this.ps.insert(this.r);

    op.subscribe(() => {
      this.ps.list().subscribe(data => this.ps.setList(data));
      this.router.navigate(['/plato']);
    });
  }

  private init(): void {
    if (this.edicion) {
      this.ps.listId(this.id).subscribe(data => {

        this.form = new FormGroup({
          id_plato: new FormControl(data.id_plato),
          precio_plato: new FormControl(data.precio_plato, Validators.required),
          nombre_plato: new FormControl(data.nombre_plato, Validators.required),
          info_nutricional: new FormControl(data.info_nutricional, Validators.required),
          id_promociones: new FormControl(data.promociones?.id_Promociones, Validators.required),
          id_restaurante: new FormControl(data.restaurante?.id_restaurante, Validators.required),
        });

      });
    }
  }
}
