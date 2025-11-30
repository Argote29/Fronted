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

import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restauranteregistrar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    GoogleMap,
    MapMarker
  ],
  templateUrl: './restauranteregistrar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './restauranteregistrar.css',
})
export class Restauranteregistrar implements OnInit {
  
  form: FormGroup = new FormGroup({});
  re: Restaurante = new Restaurante();

  edicion: boolean = false;
  id: number = 0;

  // MAPA
  center: google.maps.LatLngLiteral = { lat: -12.0464, lng: -77.0428 };
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral | undefined;

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    clickableIcons: false,
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

      ubicacion: [
        '',
        Validators.required
      ],

      cocinatip: ['', Validators.required],

      Tiempo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^.{3,40}$/) // mínimo 3 caracteres, máximo 40
        ])
      ],

      numero: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(7),
          Validators.maxLength(9)
        ])
      ]
    });
  }

  aceptar(): void {
    if (!this.form.valid) return;

    this.re.id_restaurante = this.form.value.codigo;
    this.re.nombre_restaurante = this.form.value.nombre;
    this.re.direccion = this.form.value.ubicacion;
    this.re.tipo_cocina = this.form.value.cocinatip;
    this.re.horario = this.form.value.Tiempo;
    this.re.contacto = this.form.value.numero;

    if (this.edicion) {
      this.rS.update(this.re).subscribe(() => {
        this.rS.list().subscribe(data => this.rS.setList(data));
      });
    } else {
      this.rS.insert(this.re).subscribe(() => {
        this.rS.list().subscribe(data => this.rS.setList(data));
      });
    }

    this.router.navigate(['restaurante']);
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.markerPosition = undefined; // no marcamos en mapa la edición

        this.form = new FormGroup({
          codigo: new FormControl(data.id_restaurante),

          nombre: new FormControl(data.nombre_restaurante, Validators.required),

          ubicacion: new FormControl(data.direccion, Validators.required),

          cocinatip: new FormControl(data.tipo_cocina, Validators.required),

          Tiempo: new FormControl(
            data.horario,
            Validators.compose([
              Validators.required,
              Validators.pattern(/^.{3,40}$/)
            ])
          ),

          numero: new FormControl(
            data.contacto,
            Validators.compose([
              Validators.required,
              Validators.pattern('^[0-9]+$'),
              Validators.minLength(7),
              Validators.maxLength(9)
            ])
          ),
        });
      });
    }
  }


  seleccionarUbicacion(event: google.maps.MapMouseEvent) {
    if (event.latLng) {

      this.markerPosition = event.latLng.toJSON();

      this.obtenerDireccion(this.markerPosition);
    }
  }


  obtenerDireccion(latLng: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const direccion = results[0].formatted_address;

        this.form.patchValue({ ubicacion: direccion });
      } else {
        console.error('Error al geocodificar: ' + status);
      }
    });
  }
}
