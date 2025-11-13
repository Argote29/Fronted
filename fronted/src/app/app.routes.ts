import { Routes } from '@angular/router';
import { Rol } from './components/rol/rol';
import { Rolregistrar } from './components/rol/rolregistrar/rolregistrar';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioregistrarComponent } from './components/usuario/usuarioregistrar/usuarioregistrar.component';
import { UsuariolistarComponent } from './components/usuario/usuariolistar/usuariolistar.component';
import { Ingrediente } from './components/ingrediente/ingrediente';
import { Ingredientelistar } from './components/ingrediente/ingredientelistar/ingredientelistar';
import { Ingredienteregistrar } from './components/ingrediente/ingredienteregistrar/ingredienteregistrar';
import { Historiallistar } from './components/historial/historiallistar/historiallistar';
import { Historialregistrar } from './components/historial/historialregistrar/historialregistrar';
import { Restaurante } from './components/restaurante/restaurante';
import { Restaurantelistar } from './components/restaurante/restaurantelistar/restaurantelistar';
import { Restauranteregistrar } from './components/restaurante/restauranteregistrar/restauranteregistrar';
export const routes: Routes = 
[

{path:'roles',component:Rol,
    children:[
        {path:'news',component:Rolregistrar},
        {path:'edits/:id',component:Rolregistrar}
    ]
},
{
    path: 'usuarios',
    component: UsuarioComponent,
    children: [
        { path: '', component: UsuariolistarComponent },
      { path: 'nuevo', component: UsuarioregistrarComponent},
      { path: ':id', component: UsuarioregistrarComponent}
    ]
},

{
    path: 'ingredientes',
    component: Ingrediente,
    children: [
    { path: '', component: Ingredientelistar },
      { path: 'nuevo', component: Ingredienteregistrar},
      { path: ':id', component: Ingredienteregistrar}
    ]
},

{
    path: 'historial',
    component: Ingrediente,
    children: [
    { path: '', component: Historiallistar },
      { path: 'nuevo', component: Historialregistrar},
      { path: ':id', component: Historialregistrar}
    ]
},

{
  path: 'restaurante',
  component: Restaurante,
  children: [
  { path: '', component: Restaurantelistar },
    { path: 'nuevo', component: Restauranteregistrar},
    { path: ':id', component: Restauranteregistrar}
  ]
}
];
