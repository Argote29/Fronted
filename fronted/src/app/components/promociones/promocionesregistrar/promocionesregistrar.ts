import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { ServicePromociones } from '../../../services/service-promociones';
import { RestauranteService } from '../../../services/service-restaurante';

import { Promociones } from '../../../models/promociones';
import { Restaurante } from '../../../models/Restaurante';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promocionesregistrar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './promocionesregistrar.html',
  styleUrl: './promocionesregistrar.css',
})
export class Promocionesregistrar {
  form: FormGroup = new FormGroup({});
  r: Promociones = new Promociones();
  edicion = false;
  id = 0;

  listaRestaurantes: Restaurante[] = [];

  constructor(
    private proS: ServicePromociones,
    private restS: RestauranteService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  fechasValidas: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const fechaInicio = group.get('fecha_ini')?.value;
    const fechaFin = group.get('fecha_fin')?.value;

    if (!fechaInicio || !fechaFin) return null; 

    const ini = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    return ini <= fin ? null : { fechasInvalidas: true };
  };

  ngOnInit(): void {
    this.route.params.subscribe((p: Params) => {
      this.id = p['id'];
      this.edicion = this.id != null;
      this.init();
    });

    this.restS.list().subscribe(d => (this.listaRestaurantes = d));

    this.form = this.fb.group(
      {
        id_Promociones: [''],
        descripcion: ['', [Validators.required, Validators.maxLength(200)]],
        descuento: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
        restauranteId: [null, Validators.required],
        fecha_ini: [null, Validators.required],
        fecha_fin: [null, Validators.required],
      },
      { validators: this.fechasValidas } 
    );
  }

  aceptar(): void {
    if (!this.form.valid) return;

    const v = this.form.value;

    this.r.id_Promociones = v.id_Promociones;
    this.r.descripcion = v.descripcion;
    this.r.descuento = v.descuento;
    this.r.fecha_inico_promo = v.fecha_ini;
    this.r.fecha_final_promo = v.fecha_fin;

    this.r.restaurante.id_restaurante = v.restauranteId;

    const op = this.edicion ? this.proS.update(this.r) : this.proS.insert(this.r);
    op.subscribe(() => {
      this.proS.list().subscribe(data => this.proS.setList(data));
      this.router.navigate(['/promociones']);
    });
  }

  private init(): void {
    if (this.edicion) {
      this.proS.listId(this.id).subscribe(data => {
        this.form.patchValue({
          id_Promociones: data.id_Promociones,
          descripcion: data.descripcion,
          descuento: data.descuento,
          restauranteId: data.restaurante?.id_restaurante,
          fecha_ini: data.fecha_inico_promo ? new Date(data.fecha_inico_promo) : null,
          fecha_fin: data.fecha_final_promo ? new Date(data.fecha_final_promo) : null,
        });
      });
    }
  }
}