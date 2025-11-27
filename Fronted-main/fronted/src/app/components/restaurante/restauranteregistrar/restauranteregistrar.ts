import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Restaurante } from '../../../models/Restaurante';
import { RestauranteService } from '../../../services/service-restaurante';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-restauranteregistrar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './restauranteregistrar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './restauranteregistrar.css',
})
export class Restauranteregistrar implements OnInit {
  form: FormGroup = new FormGroup({});
  re : Restaurante = new Restaurante();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private rS: RestauranteService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo:[''],
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
      cocinatip: ['', Validators.required],
      Tiempo: ['', Validators.required],
      numero: [''],
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.re.id_restaurante=this.form.value.codigo
      this.re.nombre_restaurante = this.form.value.nombre;
      this.re.direccion = this.form.value.ubicacion;
      this.re.tipo_cocina = this.form.value.cocinatip;
      this.re.horario = this.form.value.Tiempo;
      this.re.contacto = this.form.value.presupuesto;
      if(this.edicion){
        this.rS.update(this.re).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      }else{
        this.rS.insert(this.re).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      }
      this.router.navigate(['restaurante']);
    }
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.id_restaurante),
          nombre: new FormControl(data.nombre_restaurante),
          ubicacion: new FormControl(data.direccion),
          cocinatip: new FormControl(data.tipo_cocina),
          Tiempo: new FormControl(data.horario),
          numero: new FormControl(data.contacto),
        });
      });
    }
  }

}
