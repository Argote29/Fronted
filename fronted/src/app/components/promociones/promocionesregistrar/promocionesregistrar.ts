import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { ServicePromociones } from '../../../services/service-promociones';
import { RestauranteService } from '../../../services/service-restaurante';

import { Promociones } from '../../../models/promociones';
import { Restaurante } from '../../../models/Restaurante';

@Component({
  selector: 'app-promocionesregistrar',
  imports: [ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule],
  templateUrl: './promocionesregistrar.html',
  styleUrl: './promocionesregistrar.css',
})
export class Promocionesregistrar {
   form: FormGroup = new FormGroup({});
    r: Promociones = new Promociones();
    edicion = false;
    id = 0;

  listaRestaurantes: Restaurante[] = []

constructor(
    private proS: ServicePromociones,
    private restS: RestauranteService,

    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}


  
  ngOnInit(): void {
    this.route.params.subscribe((p: Params) => {
      this.id = p['id'];
      this.edicion = this.id != null;
      this.init();
    });

    
    this.restS.list().subscribe(d => (this.listaRestaurantes = d));

    
   this.form = this.fb.group({
  id_Promociones: [''],
  descripcion: ['', Validators.required],
  descuento: ['', Validators.required],
  restauranteId: [null, Validators.required],
});

  }


    aceptar(): void {
    if (!this.form.valid) return;

   
    this.r.id_Promociones = this.form.value.id_Promociones;
    this.r.descripcion= this.form.value.descripcion;
    this.r.descuento = this.form.value.descuento;

    
    this.r.fecha_inico_promo = this.r.fecha_inico_promo || new Date().toLocaleDateString('en-CA');
    this.r.fecha_final_promo = this.r.fecha_final_promo || new Date().toLocaleDateString('en-CA');

  
    this.r.restaurante.id_restaurante = this.form.value.restauranteId;

    
    const op = this.edicion ? this.proS.update(this.r) : this.proS.insert(this.r);
    op.subscribe(() => {
      this.proS.list().subscribe(data => this.proS.setList(data));
      this.router.navigate(['/promociones']);
    });
  }

   private init(): void {
    if (this.edicion) {
      this.proS.listId(this.id).subscribe(data => {
        
        this.r.fecha_inico_promo = data.fecha_inico_promo;
        this.r.fecha_final_promo = data.fecha_final_promo;

      this.form = new FormGroup({
  id_Promociones: new FormControl(data.id_Promociones),
  descripcion: new FormControl(data.descripcion, Validators.required),
  descuento: new FormControl(data.descuento, Validators.required),
  restauranteId: new FormControl(data.restaurante?.id_restaurante, Validators.required),
});

      });
    }
  }

}
