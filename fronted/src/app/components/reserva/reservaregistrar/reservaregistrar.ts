import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Usuario } from '../../../models/usuario';
import { Restaurante } from '../../../models/Restaurante';
import { Reserva } from '../../../models/Reserva';

import { ServiceUsuario } from '../../../services/service-usuario';
import { RestauranteService } from '../../../services/service-restaurante';
import { ServiceReserva } from '../../../services/service-reserva';
import { LoginService } from '../../../services/login-service'; // Importar el LoginService

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-reservaregistrar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerToggle
  ],
  templateUrl: './reservaregistrar.html',
  styleUrl: './reservaregistrar.css'
})
export class Reservaregistrar implements OnInit {
  form: FormGroup = new FormGroup({});
  r: Reserva = new Reserva();

  edicion = false;
  id = 0;

  listaUsuarios: Usuario[] = [];
  listaRestaurantes: Restaurante[] = [];

  // Variables de control de rol
  esAdmin: boolean = false;
  puedeModificarEstado: boolean = false; // <-- NUEVA PROPIEDAD para el estado
  usuarioLogueadoId: number | null = null; // Usamos 'number' porque es el ID PK

  minDate: Date = new Date();

  constructor(
    private rs: ServiceReserva,
    private us: ServiceUsuario,
    private restS: RestauranteService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loginService: LoginService // Inyectar el LoginService
  ) {}
  

  ngOnInit(): void {
    // 1. Obtener Rol e ID del usuario logueado
    const roles = this.loginService.showRole();
    const idIdentificador = this.loginService.showIdUser();
    
    // Verificar si es ADMIN
    this.esAdmin = (Array.isArray(roles) && roles.some(r => r.includes('ADMIN'))) || 
                   (typeof roles === 'string' && roles.includes('ADMIN'));

    // NEW LOGIC: Determinar si el usuario puede cambiar el estado (ADMIN o RESTAURANT)
    const esRestaurant = (Array.isArray(roles) && roles.some(r => r.includes('RESTAURANT'))) || 
                         (typeof roles === 'string' && roles.includes('RESTAURANT'));
    this.puedeModificarEstado = this.esAdmin || esRestaurant; 

    // 2. Inicializar el formulario
    this.form = this.fb.group({
      id: [''],
      fecha_reserva: [
        '',
        Validators.compose([
          Validators.required,
          (control) => {
            const fecha: Date = control.value;
            if (!fecha) return null;
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            fecha.setHours(0, 0, 0, 0);
            return fecha < hoy ? { fechaInvalida: true } : null;
          }
        ])
      ],
      hora: [
        '',
        Validators.compose([
          Validators.required,
          (control) => {
            const hora = control.value;
            if (!hora) return null;
            const [h] = hora.split(':').map(Number);
            return h < 11 || h > 20 ? { horaInvalida: true } : null;
          }
        ])
      ],
      numero_personas: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ],
      // ESTADO: Deshabilitado si el usuario NO es ADMIN/RESTAURANT
      estado: [
        { value: 'Pendiente', disabled: !this.puedeModificarEstado }, // <-- Lógica aplicada aquí
        Validators.required
      ],
      usuarioId: [null, Validators.required],
      restauranteId: [null, Validators.required],
    });

    // 3. Cargar datos condicionalmente
    this.restS.list().subscribe(data => (this.listaRestaurantes = data));

    if (this.esAdmin) {
      // ADMIN: Carga todos los usuarios
      this.us.list().subscribe(data => (this.listaUsuarios = data));
    } else if (typeof idIdentificador === 'string') {
      // CLIENT: Obtiene el ID numérico del Backend
      this.loginService.fetchUserIdByEmail(idIdentificador).subscribe({
        next: (id: number) => {
          this.usuarioLogueadoId = id;
          // Carga solo su propio usuario para la lista
          this.us.listId(id).subscribe(usuario => {
            this.listaUsuarios = [usuario];
            // Preseleccionar su ID
            this.form.get('usuarioId')?.setValue(id);
          });
        },
        error: (err) => {
          console.error("Error al obtener ID del usuario logueado para Reserva:", err);
          this.listaUsuarios = []; 
        }
      });
    }

    // 4. Inicializar en modo edición
    this.route.params.subscribe((p: Params) => {
      this.id = p['id'];
      this.edicion = this.id != null;
      this.init();
    });
  }

  aceptar(): void {
    if (!this.form.valid) return;

    // Usamos getRawValue para obtener el valor de estado y usuarioId incluso si está deshabilitado
    const raw = this.form.getRawValue();

    // Validación de seguridad para CLIENT (solo puede reservar para sí mismo)
    if (!this.esAdmin && raw.usuarioId !== this.usuarioLogueadoId) {
        console.error("Error de seguridad: El cliente está intentando registrar una reserva para otro usuario.");
        alert("Operación no permitida: Solo puedes reservar para ti mismo."); 
        return;
    }

    // Convertir Date → "YYYY-MM-DD"
    let fechaFormateada = "";
    if (raw.fecha_reserva instanceof Date) {
      fechaFormateada = raw.fecha_reserva.toISOString().split("T")[0];
    } else {
      fechaFormateada = raw.fecha_reserva;
    }

    this.r.id_reserva = raw.id;
    this.r.fecha_reserva = fechaFormateada as any;
    this.r.hora = raw.hora;
    this.r.numero_personas = raw.numero_personas;
    this.r.estado = raw.estado;
    this.r.usuario.id_usuario = raw.usuarioId;
    this.r.restaurante.id_restaurante = raw.restauranteId;

    const operacion = this.edicion ? this.rs.update(this.r) : this.rs.insert(this.r);

    operacion.subscribe(() => {
      this.rs.list().subscribe(data => this.rs.setList(data));
      this.router.navigate(['/reserva']);
    });
  }

  init(): void {
    if (this.edicion) {
      this.rs.listId(this.id).subscribe(data => {
        this.r = data;

        this.form.patchValue({
          id: data.id_reserva,
          fecha_reserva: new Date(data.fecha_reserva),
          hora: data.hora,
          numero_personas: data.numero_personas,
          estado: data.estado, 
          usuarioId: data.usuario?.id_usuario,
          restauranteId: data.restaurante?.id_restaurante,
        });
        
        // CONTROL DE ROL EN EDICIÓN: Deshabilitar/Habilitar el estado
        if (!this.puedeModificarEstado) {
            this.form.get('estado')?.disable();
        } else {
            this.form.get('estado')?.enable(); 
        }

        // CONTROL DE ROL EN EDICIÓN: Deshabilitar el usuarioId si es cliente (ya existente)
        if (!this.esAdmin) {
            this.form.get('usuarioId')?.disable();
        }
      });
    }
  }

  volverAPadre() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}