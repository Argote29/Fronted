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
// 1. IMPORTAR GOOGLE MAPS
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common'; // Importante para *ngIf

@Component({
  selector: 'app-restauranteregistrar',
  standalone: true,
  imports: [
    CommonModule, // Necesario para directivas como *ngIf
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    GoogleMap, // Importar el componente del mapa
    MapMarker  // Importar el marcador
  ],
  templateUrl: './restauranteregistrar.html', // Asegúrate que el nombre del archivo coincida
  providers: [provideNativeDateAdapter()],
  styleUrl: './restauranteregistrar.css', // Asegúrate que el nombre coincida
})
export class Restauranteregistrar implements OnInit { // Renombré la clase por convención (Component)
  form: FormGroup = new FormGroup({});
  re: Restaurante = new Restaurante();

  edicion: boolean = false;
  id: number = 0;

  // 2. CONFIGURACIÓN DEL MAPA
  center: google.maps.LatLngLiteral = { lat: -12.0464, lng: -77.0428 }; // Lima, Perú (Puedes cambiarlo)
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral | undefined;
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false, // Muestra controles de zoom
    clickableIcons: false,   // Evita clics accidentales en POIs de Google
  };

  constructor(
    private rS: RestauranteService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
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
      codigo: [''],
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required], // Aquí guardaremos la dirección
      cocinatip: ['', Validators.required],
      Tiempo: ['', Validators.required],
<<<<<<< HEAD
      numero: ['',Validators.required],
=======
      numero: [''],
>>>>>>> 32923653bc662f1f1a7ddaa62e58baf03e92454d
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.re.id_restaurante = this.form.value.codigo;
      this.re.nombre_restaurante = this.form.value.nombre;
      this.re.direccion = this.form.value.ubicacion;
      this.re.tipo_cocina = this.form.value.cocinatip;
      this.re.horario = this.form.value.Tiempo;
      this.re.contacto = this.form.value.numero; // Corregido: era 'presupuesto' en tu código anterior

      if (this.edicion) {
        this.rS.update(this.re).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      } else {
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

  // 3. LÓGICA DEL MAPA: AL HACER CLIC
  seleccionarUbicacion(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      // Llamamos a la función para obtener el nombre de la calle
      this.obtenerDireccion(this.markerPosition);
    }
  }

  // 4. GEOCODING: CONVERTIR COORDENADAS A TEXTO
  obtenerDireccion(latLng: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const direccion = results[0].formatted_address;
        
        console.log('Dirección encontrada:', direccion);

        // Actualizamos el campo 'ubicacion' del formulario
        this.form.patchValue({
          ubicacion: direccion
        });
      } else {
        console.error('Error al geocodificar: ' + status);
      }
    });
  }
}