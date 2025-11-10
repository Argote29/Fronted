import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Usuario } from '../../../models/usuario';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceUsuario } from '../../../services/service-usuario';

@Component({
  selector: 'app-usuarioregistrar',
  imports: [ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatRadioModule,MatButtonModule],
  templateUrl: './usuarioregistrar.component.html',
  styleUrl: './usuarioregistrar.component.css'
})
export class UsuarioregistrarComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  u: Usuario = new Usuario();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private uS: ServiceUsuario,
    private router: Router ,
    private formBuilder: FormBuilder ,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params ) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      direccion: [''],
      telefono: ['', Validators.required],
      genero: ['', Validators.required],
      id_rol: ['', Validators.required]
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.u.id_usuario = this.form.value.codigo;
      this.u.nombre = this.form.value.nombre;
      this.u.apellido = this.form.value.apellido;
      this.u.correo = this.form.value.correo;
      this.u.contrasena = this.form.value.contrasena;
      this.u.direccion = this.form.value.direccion;
      this.u.telefono = this.form.value.telefono;
      this.u.genero = this.form.value.genero;
      this.u.id_rol = this.form.value.id_rol;

      if (this.edicion) {
        this.uS.update(this.u).subscribe(() => {
          this.uS.list().subscribe((data) => this.uS.setList(data));
        });
      } else {
        this.uS.insert(this.u).subscribe(() => {
          this.uS.list().subscribe((data) => this.uS.setList(data));
        });
      }

      this.router.navigate(['usuarios']);
    }
  }

  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.id_usuario),
          nombre: new FormControl(data.nombre),
          apellido: new FormControl(data.apellido),
          correo: new FormControl(data.correo),
          contrasena: new FormControl(data.contrasena),
          direccion: new FormControl(data.direccion),
          telefono: new FormControl(data.telefono),
          genero: new FormControl(data.genero),
          id_rol: new FormControl(data.id_rol)
        });
      });
    }
  }
}