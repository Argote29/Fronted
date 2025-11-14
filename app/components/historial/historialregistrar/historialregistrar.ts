import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Historial } from '../../../models/historial';
import { Usuario } from '../../../models/usuario';
import { ServiceHistorial } from '../../../services/service-historial';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceUsuario } from '../../../services/service-usuario';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-historialregistrar',
  imports: [MatSelectModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatRadioModule,MatButtonModule,MatDatepickerModule,MatNativeDateModule],
  templateUrl: './historialregistrar.html',
  styleUrl: './historialregistrar.css',
})
export class Historialregistrar implements OnInit{
form: FormGroup = new FormGroup({});
  h: Historial = new Historial();

  edicion: boolean = false;
  id: number = 0;
  listaUsuarios: Usuario[] = [];

  constructor(
    private hS: ServiceHistorial,
    private router: Router ,
    private formBuilder: FormBuilder ,
    private route: ActivatedRoute,
    private uS:ServiceUsuario
  ) {}

volverAPadre() {
  this.router.navigate(['../'], { relativeTo: this.route });
}

ngOnInit(): void {
    this.route.params.subscribe((data: Params ) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      fecha_ini: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      status: ['', Validators.required],
      fk: ['', Validators.required]
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.h.id_historial = this.form.value.codigo;
      this.h.fecha_inicio_sub = this.form.value.fecha_ini;
      this.h.fecha_final_sub = this.form.value.fecha_fin;
      this.h.estado = this.form.value.status;
      this.h.usuario.id_usuario = this.form.value.fk;

      if (this.edicion) {
        this.hS.update(this.h).subscribe(() => {
          this.hS.list().subscribe((data) => this.hS.setList(data));
        });
      } else {
        this.hS.insert(this.h).subscribe(() => {
          this.hS.list().subscribe((data) => this.hS.setList(data));
        });
      }

      this.router.navigate(['historial']);
    }
  }

  init() {
    if (this.edicion) {
      this.hS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.id_historial),
          fecha_ini: new FormControl(data.fecha_inicio_sub),
          fecha_fin: new FormControl(data.fecha_final_sub),
          status: new FormControl(data.estado),
          fk: new FormControl(data.usuario.id_usuario)
        });
      });
    }
  }
}
