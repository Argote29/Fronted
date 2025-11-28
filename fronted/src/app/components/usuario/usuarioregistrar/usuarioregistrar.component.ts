import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Usuario } from '../../../models/usuario';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceUsuario } from '../../../services/service-usuario';
import { RolService } from '../../../services/service-rol';
import { Rol } from '../../../models/rol';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarioregistrar',
  standalone: true, // Asumo que usas Standalone components o que esto es un componente regular
  imports: [MatSelectModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatRadioModule,MatButtonModule,CommonModule],
  templateUrl: './usuarioregistrar.component.html',
  styleUrl: './usuarioregistrar.component.css'
})
export class UsuarioregistrarComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  u: Usuario = new Usuario();

  edicion: boolean = false;
  id: number = 0;
  // Esta lista contendrá solo CLIENTE y RESTAURANT en modo registro
  listaRoles: Rol[] = []; 


  constructor(
    private uS: ServiceUsuario,
    private router: Router ,
    private formBuilder: FormBuilder ,
    private route: ActivatedRoute,
    private rS:RolService
  ) {}

  volverAPadre() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnInit(): void {
    // 1. Inicializar el formulario primero
    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      apellido: ['', [Validators.required, Validators.maxLength(60)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(60), Validators.pattern('^.+?\.com$')]],
      contrasena: ['', [Validators.required, Validators.maxLength(100),Validators.minLength(5)]],
      direccion: ['',[Validators.required,Validators.maxLength(60)]],
      telefono: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      genero: ['', [Validators.required,Validators.maxLength(9)]],
      fk: ['', [Validators.required]]
    });
    
    // 2. Suscribirse a los parámetros de ruta para determinar si es edición
    this.route.params.subscribe((data: Params ) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init(); // Cargar datos del usuario si es edición

      // 3. Cargar y filtrar los roles DESPUÉS de saber si es edición o registro
      this.rS.list().subscribe((rolesData: Rol[]) => {
        // Asumo que el objeto Rol tiene una propiedad 'nombre' (Rol.nombre)
        if (!this.edicion) {
          // --- Lógica de Filtrado Exclusiva para Registro ---
          this.listaRoles = rolesData.filter(rol => 
            rol.nombre === 'CLIENT' || rol.nombre === 'RESTAURANT'
          );
          // ----------------------------------------------------
        } else {
          // Si es edición, se muestran todos los roles
          this.listaRoles = rolesData; 
        }
      });
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
      // Asegúrate de que el objeto rol esté inicializado
      this.u.rol = new Rol(); 
      this.u.rol.id_rol = this.form.value.fk;

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
        this.form.patchValue({
          codigo: data.id_usuario,
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          contrasena: data.contrasena,
          direccion: data.direccion,
          telefono: data.telefono,
          genero: data.genero,
          fk: data.rol.id_rol
        });
      });
    }
  }
}