import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {  MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Ingredientesplato } from '../../../models/ingredientesplato';
import { ServiceIngredientesplato } from '../../../services/service-ingredientesplato';

import { Plato } from '../../../models/plato';
import { ServicePlato } from '../../../services/service-plato';

import { Ingrediente } from '../../../models/ingrediente';
import { ServiceIngrediente } from '../../../services/service-ingrediente';

@Component({
  selector: 'app-ingredientesplatoregistrar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './ingredientesplatoregistrar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './ingredientesplatoregistrar.css',
})
export class Ingredientesplatoregistrar {
form: FormGroup = new FormGroup ({});
i: Ingredientesplato = new Ingredientesplato();
edicion = false;
id = 0;

listaPlato: Plato [] = [];
listaIngrediente: Ingrediente[] = [];

constructor(
    private si: ServiceIngredientesplato,
    private sp: ServicePlato,
    private is: ServiceIngrediente,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
){}

ngOnInit(): void {
    this.route.params.subscribe((p: Params) => {
      this.id = p['id'];
      this.edicion = this.id != null;
      this.init();
    });

    
    this.sp.list().subscribe(d => (this.listaPlato = d));
    this.is.list().subscribe(d => (this.listaIngrediente = d));

    
    this.form = this.fb.group({
  cantidad: [0, [Validators.required, Validators.min(1), Validators.max(20)]],
  tipo_unidad: ['', Validators.required],
  platoId: [null, Validators.required],
  ingredienteId: [null, Validators.required],
});
  }

  aceptar(): void {
  if (!this.form.valid) return;

  // Asignar valores desde el formulario
  this.i.cantidad = this.form.value.cantidad;
  this.i.tipo_unidad = this.form.value.tipo_unidad;

  // Asignar relaciones
  this.i.plato.id_plato = this.form.value.platoId;
  this.i.ingredientes.id_ingredientes = this.form.value.ingredienteId;

  const op = this.edicion ? this.si.update(this.i) : this.si.insert(this.i);

  op.subscribe(() => {
    this.si.list().subscribe(data => this.si.setList(data));
    this.router.navigate(['/ingredientesplato']);
  });
}

  private init(): void {
  if (this.edicion) {
    this.si.listId(this.id).subscribe(data => {
      this.form = new FormGroup({
        cantidad: new FormControl(data.cantidad, Validators.required),
        tipo_unidad: new FormControl(data.tipo_unidad, Validators.required),
        platoId: new FormControl(data.plato?.id_plato, Validators.required),
        ingredienteId: new FormControl(data.ingredientes?.id_ingredientes, Validators.required),
      });
    });
  }
}
}
