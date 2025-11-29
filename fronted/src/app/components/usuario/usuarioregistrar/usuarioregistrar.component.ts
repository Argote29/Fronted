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
import { LoginService } from '../../../services/login-service'; // Importamos el servicio de login

@Component({
  selector: 'app-usuarioregistrar',
  standalone: true,
  imports: [MatSelectModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatRadioModule,MatButtonModule,CommonModule],
  templateUrl: './usuarioregistrar.component.html',
  styleUrl: './usuarioregistrar.component.css'
})
export class UsuarioregistrarComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  u: Usuario = new Usuario();

  edicion: boolean = false;
  id: number = 0;
  
  listaRoles: Rol[] = []; 
  rolesLogueado: any = ''; // Rol del usuario logueado (ej: 'ADMIN' o ['ROLE_CLIENT'])


  constructor(
    private uS: ServiceUsuario,
    private router: Router ,
    private formBuilder: FormBuilder ,
    private route: ActivatedRoute,
    private rS:RolService,
    private loginService: LoginService // Inyectamos el servicio de login
  ) {}

  /**
   * Carga el rol del usuario logueado y comprueba si incluye el rolName dado.
   * Maneja tanto el formato Array (['ROLE_ADMIN']) como String ('ADMIN').
   */
  private hasRole(roleName: string): boolean {
    // Aseguramos que el rol del usuario logueado esté cargado
    this.rolesLogueado = this.loginService.showRole() || null; 

    if (!this.rolesLogueado) return false;

    const expectedRole = roleName.toLowerCase();
    
    let rolesToCheck: string[] = [];
    
    if (Array.isArray(this.rolesLogueado)) {
        rolesToCheck = this.rolesLogueado;
    } else if (typeof this.rolesLogueado === 'string') {
        rolesToCheck = [this.rolesLogueado]; 
    } else {
        return false;
    }

    return rolesToCheck.some((roleElement: string) => {
        return roleElement && roleElement.toLowerCase().includes(expectedRole);
    });
  }

  /** Retorna true si el usuario logueado es ADMIN. */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
  
  volverAPadre() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      apellido: ['', [Validators.required, Validators.maxLength(60)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(60), Validators.pattern('^.+?\.com$')]],
      // Quitamos required de contraseña si es edición, lo cual es manejado por init()
      contrasena: ['', [Validators.maxLength(100),Validators.minLength(5),Validators.required]], 
      direccion: ['',[Validators.required,Validators.maxLength(60)]],
      telefono: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      genero: ['', [Validators.required,Validators.maxLength(9)]],
      fk: ['', [Validators.required]]
    });
    
    // 2. Suscribirse a los parámetros de ruta para determinar si es edición
    this.route.params.subscribe((data: Params ) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;

      // Determinamos el rol del usuario logueado
      const esAdmin = this.isAdmin();

      this.init(); // Cargar datos del usuario si es edición

      // Si es edición, si no es ADMIN, deshabilitamos el campo Rol
      if (this.edicion && !esAdmin) {
        this.form.get('fk')?.disable();
      }
      // Si es registro, la contraseña es obligatoria
      if (!this.edicion) {
          this.form.get('contrasena')?.addValidators(Validators.required);
      }
      this.form.get('contrasena')?.updateValueAndValidity();


      // 3. Cargar y FILTRAR los roles según el usuario logueado
      this.rS.list().subscribe((rolesData: Rol[]) => {
        
        // Si el usuario logueado es ADMIN, ve todos los roles
        if (esAdmin) {
          this.listaRoles = rolesData;
        } 
        // Si el usuario logueado NO es ADMIN, solo ve CLIENTE y RESTAURANT
        else {
          this.listaRoles = rolesData.filter(rol => 
            // Usamos toUpperCase() para asegurar la comparación si los nombres de rol varían (ej: 'client' vs 'CLIENT')
            rol.nombre.toUpperCase() === 'CLIENT' || rol.nombre.toUpperCase() === 'RESTAURANT'
          );
        }
      });
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      // Si el campo 'fk' (Rol) fue deshabilitado por no ser admin, 
      // su valor no se incluye en this.form.value. Necesitamos usar getRawValue().
      const formValue = this.form.getRawValue();

      this.u.id_usuario = formValue.codigo;
      this.u.nombre = formValue.nombre;
      this.u.apellido = formValue.apellido;
      this.u.correo = formValue.correo;
      this.u.contrasena = formValue.contrasena;
      this.u.direccion = formValue.direccion;
      this.u.telefono = formValue.telefono;
      this.u.genero = formValue.genero;
      this.u.rol = new Rol(); 
      this.u.rol.id_rol = formValue.fk;

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
        this.form.get('contrasena')?.removeValidators(Validators.required); 
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