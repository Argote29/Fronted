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
import { Rol } from '../../../models/rol';
import { RolService } from '../../../services/service-rol';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-rolregistrar',
  imports: [MatPaginatorModule,ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatButtonModule, CommonModule,MatSelectModule],
  templateUrl: './rolregistrar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './rolregistrar.css',
})
export class Rolregistrar implements OnInit {
  form: FormGroup = new FormGroup({});
  r: Rol = new Rol();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private rS: RolService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }
  
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
      codigo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.r.id_rol = this.form.value.codigo
      this.r.nombre = this.form.value.nombre;
      this.r.descripcion = this.form.value.descripcion;
      if (this.edicion) {
        this.rS.update(this.r).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      } else {
        this.rS.insert(this.r).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      }
      this.router.navigate(['roles']);
    }
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = this.formBuilder.group({
          codigo: [data.id_rol],
          nombre: [data.nombre, [Validators.required, Validators.maxLength(30)]],
          descripcion: [data.descripcion, [Validators.required, Validators.maxLength(200)]]
        });
      });
    }
  }
}