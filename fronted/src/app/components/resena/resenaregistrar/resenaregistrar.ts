import { Component } from '@angular/core';
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


@Component({
  selector: 'app-resenaregistrar',
  imports: [ ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule],
  templateUrl: './resenaregistrar.html',
  styleUrl: './resenaregistrar.css'
})
export class Resenaregistrar {
 form: FormGroup = new FormGroup({});
  r: Resena = new Resena();
  edicion = false;
  id = 0;

  listaUsuarios: Usuario[] = [];
  listaRestaurantes: Restaurante[] = [];

  constructor(
    private rs: ServiceResena,
    private us: ServiceUsuario,
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

    
    this.us.list().subscribe(d => (this.listaUsuarios = d));
    this.restS.list().subscribe(d => (this.listaRestaurantes = d));

    
    this.form = this.fb.group({
      id: [''],
      comentario: ['', Validators.required],
      calificacion: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      usuarioId: [null, Validators.required],
      restauranteId: [null, Validators.required],
      
    });
  }

  aceptar(): void {
    if (!this.form.valid) return;

   
    this.r.id_resena = this.form.value.id;
    this.r.comentario = this.form.value.comentario;
    this.r.calificacion = this.form.value.calificacion;

    
    this.r.fecha_resena = this.r.fecha_resena || new Date().toLocaleDateString('en-CA');

    
    this.r.usuario.id_usuario = this.form.value.usuarioId;
    this.r.restaurante.id_restaurante = this.form.value.restauranteId;

    
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

        this.form = new FormGroup({
          id: new FormControl(data.id_resena),
          comentario: new FormControl(data.comentario, Validators.required),
          calificacion: new FormControl(data.calificacion, [Validators.required, Validators.min(0), Validators.max(5)]),
          usuarioId: new FormControl(data.usuario?.id_usuario, Validators.required),
          restauranteId: new FormControl(data.restaurante?.id_restaurante, Validators.required),
        });
      });
    }
  }
}
