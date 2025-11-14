import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Ingrediente } from '../../../models/ingrediente';
import { ServiceIngrediente } from '../../../services/service-ingrediente';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-ingredienteregistrar',
  imports: [ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatRadioModule,MatButtonModule,],
  templateUrl: './ingredienteregistrar.html',
  styleUrl: './ingredienteregistrar.css',
  providers: [provideNativeDateAdapter()],

})
export class Ingredienteregistrar implements OnInit{

 form: FormGroup = new FormGroup({});
  ig:Ingrediente = new Ingrediente();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private iS: ServiceIngrediente,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {}
  
volverAPadre() {
  this.router.navigate(['../'], { relativeTo: this.route });
}
ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo:[''],
      nombre: ['', Validators.required],
      tipo: [false, Validators.required],
      nivel: ['', Validators.required],
      formas: ['', Validators.required],
      origenig: ['', Validators.required],
      contiene: [false, Validators.required],
     
    });
  }
    aceptar(): void {
    if (this.form.valid) {
      this.ig.id_ingredientes=this.form.value.codigo
      this.ig.nombre_ingrediente = this.form.value.nombre;
      this.ig.tipo_natural = this.form.value.tipo;
      this.ig.nivel_insecticida = this.form.value.nivel;
      this.ig.formas_preparar = this.form.value.formas;
      this.ig.origen = this.form.value.origenig;

      this.ig.contiene_gluten = this.form.value.contiene;
      if(this.edicion){
        this.iS.update(this.ig).subscribe((data) => {
          this.iS.list().subscribe((data) => {
            this.iS.setList(data);
          });
        });
      }else{
        this.iS.insert(this.ig).subscribe((data) => {
          this.iS.list().subscribe((data) => {
            this.iS.setList(data);
          });
        });
      }
      this.router.navigate(['ingredientes']);
    }
  }

  init() {
    if (this.edicion) {
      this.iS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.id_ingredientes),
          nombre: new FormControl(data.nombre_ingrediente),
          tipo: new FormControl(data.tipo_natural),
          nivel: new FormControl(data.nivel_insecticida),
          formas: new FormControl(data.formas_preparar),
          origenig: new FormControl(data.origen),
          contiene: new FormControl(data.contiene_gluten),
        });
      });
    }
  }
}
