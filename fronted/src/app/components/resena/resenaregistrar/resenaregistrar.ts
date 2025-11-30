import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceUsuario } from '../../../services/service-usuario';
import { ServiceResena } from '../../../services/service-resena';
import { RestauranteService } from '../../../services/service-restaurante';
import { Usuario } from '../../../models/usuario';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Restaurante } from '../../../models/Restaurante';
import { Resena } from '../../../models/resena';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../../services/login-service'; // Importar el LoginService

@Component({
  selector: 'app-resenaregistrar',
  imports: [ ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,MatIconModule   ],
  templateUrl: './resenaregistrar.html',
  styleUrl: './resenaregistrar.css'
})
export class Resenaregistrar implements OnInit { // Asegurar que implementa OnInit
  form: FormGroup = new FormGroup({});
  r: Resena = new Resena();
  edicion = false;
  id = 0;

  listaUsuarios: Usuario[] = [];
  listaRestaurantes: Restaurante[] = [];
  
  // Variables de control de rol
  esAdmin: boolean = false;
  usuarioLogueadoId: number | string | null = null;

    stars = [1, 2, 3, 4, 5];

  setRating(value: number) {
    this.form.patchValue({ calificacion: value });
  }


  constructor(
    private rs: ServiceResena,
    private us: ServiceUsuario,
    private restS: RestauranteService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loginService: LoginService // Inyectar el LoginService
  ) {}
volverAPadre() {
  this.router.navigate(['../'], { relativeTo: this.route });
}

  ngOnInit(): void {
    // Obtener Rol e ID del usuario logueado
    const roles = this.loginService.showRole();
    const idIdentificador = this.loginService.showIdUser();
    
    // Verificar si es ADMIN (asumiendo que showRole devuelve una cadena o array que contiene 'ADMIN')
    this.esAdmin = (Array.isArray(roles) && roles.some(r => r.includes('ADMIN'))) || 
                   (typeof roles === 'string' && roles.includes('ADMIN'));

    // Asignar el ID (Nota: Si el token solo tiene el correo, usaremos el servicio para buscar el ID en el Backend)
    // Usamos el ID de la URL si se está editando para buscar la reseña
    this.route.params.subscribe((p: Params) => {
      this.id = p['id'];
      this.edicion = this.id != null;
      this.init();
    });
    
    // ----------------------------------------------------------------------------------
    // 🔒 LÓGICA DE CONTROL DE USUARIO Y CARGA DE DATOS
    // ----------------------------------------------------------------------------------

    // Inicializar el formulario primero para evitar errores de referencia
    this.form = this.fb.group({
      id: [''],
      comentario: ['', [Validators.required, Validators.maxLength(200)]],
      calificacion: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      usuarioId: [null, Validators.required],
      restauranteId: [null, Validators.required],
    });

    // Cargar restaurantes (siempre visible para todos)
    this.restS.list().subscribe(d => (this.listaRestaurantes = d));

    // 1. Si es CLIENT o RESTAURANT (No-ADMIN), obtenemos el ID numérico
    if (!this.esAdmin && typeof idIdentificador === 'string') {
        // Obtenemos el ID numérico del Backend (como implementamos en pasos anteriores)
        this.loginService.fetchUserIdByEmail(idIdentificador).subscribe({
            next: (id: number) => {
                this.usuarioLogueadoId = id;
                this.us.listId(id).subscribe(usuario => {
                    // Si no es ADMIN, la lista solo contendrá al usuario logueado
                    this.listaUsuarios = [usuario];
                    this.form.get('usuarioId')?.setValue(id);
                    // Deshabilitar el control para que el CLIENT no pueda cambiar su ID
                    this.form.get('usuarioId')?.disable();
                });
            },
            error: (err) => {
                console.error("Error al obtener ID del usuario logueado:", err);
                // Si falla, limpiar la lista para que no se pueda registrar
                this.listaUsuarios = []; 
            }
        });
    } 
    // 2. Si es ADMIN, cargamos la lista completa de usuarios
    else if (this.esAdmin) {
        this.us.list().subscribe(d => (this.listaUsuarios = d));
    }
    
    // ----------------------------------------------------------------------------------
    
    // Esto se mantiene, pero se llama a this.init() dentro del subscribe para evitar race conditions
  }

  aceptar(): void {
    if (!this.form.valid) return;
    
    // Si el campo está deshabilitado, el valor no se incluye en form.value.
    // Usamos getRawValue() para obtener el valor, o el valor que ya asignamos
    const formValues = this.form.getRawValue(); 

    this.r.id_resena = formValues.id;
    this.r.comentario = formValues.comentario;
    this.r.calificacion = formValues.calificacion;
    this.r.fecha_resena = this.r.fecha_resena || new Date().toLocaleDateString('en-CA');
    this.r.usuario.id_usuario = formValues.usuarioId;
    this.r.restaurante.id_restaurante = formValues.restauranteId;
    
    // Validación extra para asegurar que un CLIENT solo se registra a sí mismo
    if (!this.esAdmin && this.r.usuario.id_usuario !== this.usuarioLogueadoId) {
        console.error("Error de seguridad: El cliente está intentando registrar una reseña para otro usuario.");
        alert("Operación no permitida."); // Usar un MatSnackBar real aquí
        return;
    }

    const op = this.edicion ? this.rs.update(this.r) : this.rs.insert(this.r);
    op.subscribe(() => {
      this.rs.list().subscribe(data => this.rs.setList(data));
      this.router.navigate(['/resena']);
    });
  }

  private init(): void {
    if (this.edicion) {
      this.rs.listId(this.id).subscribe(data => {
        
        this.r.fecha_resena = data.fecha_resena;
        this.form.patchValue({
          id: data.id_resena,
          comentario: data.comentario,
          calificacion: data.calificacion,
          usuarioId: data.usuario?.id_usuario,
          restauranteId: data.restaurante?.id_restaurante,
        });

        // Si es CLIENT, asegura que el campo esté deshabilitado incluso en edición
        if (!this.esAdmin) {
            this.form.get('usuarioId')?.disable();
        }
      });
    }
  }
}