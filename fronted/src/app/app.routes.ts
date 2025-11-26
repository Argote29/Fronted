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
import { Resenalistar } from './components/resena/resenalistar/resenalistar';
import { Resenaregistrar } from './components/resena/resenaregistrar/resenaregistrar';
import { Resena } from './components/resena/resena';

import { Promociones } from './components/promociones/promociones';
import { Promocioneslistar } from './components/promociones/promocioneslistar/promocioneslistar';
import { Promocionesregistrar } from './components/promociones/promocionesregistrar/promocionesregistrar';

import { Plato } from './components/plato/plato';
import { Platolistar } from './components/plato/platolistar/platolistar';
import { Platoregistrar } from './components/plato/platoregistrar/platoregistrar';
import { Rollistar } from './components/rol/rollistar/rollistar';


import { Ingredientesplatolistar } from './components/ingredientesplato/ingredientesplatolistar/ingredientesplatolistar';
import { Ingredientesplatoregistrar } from './components/ingredientesplato/ingredientesplatoregistrar/ingredientesplatoregistrar';
import { Ingredientesplato } from './components/ingredientesplato/ingredientesplato';
import { Autenticador } from './components/autenticador/autenticador';
import { Home } from './components/home/home';
import { seguridadGuard } from './guard/seguridad-guard';
import { Reporteporcentajeusuario } from './components/reporteporcentajeusuario/reporteporcentajeusuario';

export const routes: Routes = 
[
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
  ,
  {
    path: 'login',
    component: Autenticador,
  },
  
{path:'roles',component:Rol,
    children:[
        {path:'',component:Rollistar, canActivate: [seguridadGuard]},
        {path:'nuevo',component:Rolregistrar, canActivate: [seguridadGuard]},
        { path: ':id', component: Rolregistrar, canActivate: [seguridadGuard]}
    ]
},
{
    path: 'usuarios',
    component: UsuarioComponent,
    children: [
        { path: '', component: UsuariolistarComponent, canActivate: [seguridadGuard] },
      { path: 'nuevo', component: UsuarioregistrarComponent},
      { path: ':id', component: UsuarioregistrarComponent, canActivate: [seguridadGuard]}
    ]
},

{
    path: 'ingredientes',
    component: Ingrediente,
    children: [
    { path: '', component: Ingredientelistar, canActivate: [seguridadGuard] },
      { path: 'nuevo', component: Ingredienteregistrar, canActivate: [seguridadGuard]},
      { path: ':id', component: Ingredienteregistrar, canActivate: [seguridadGuard]}
    ]
},

{
    path: 'historial',
    component: Ingrediente,
    children: [
    { path: '', component: Historiallistar, canActivate: [seguridadGuard] },
      { path: 'nuevo', component: Historialregistrar, canActivate: [seguridadGuard]},
      { path: ':id', component: Historialregistrar, canActivate: [seguridadGuard]}
    ]
},

{
  path: 'restaurante',
  component: Restaurante,
  children: [
  { path: '', component: Restaurantelistar , canActivate: [seguridadGuard]},
    { path: 'nuevo', component: Restauranteregistrar, canActivate: [seguridadGuard]},
    { path: ':id', component: Restauranteregistrar, canActivate: [seguridadGuard]},
  ]
},
{
  path: 'resena', 
  component: Resena,
  children: [
    { path: '', component: Resenalistar, canActivate: [seguridadGuard] },          
    { path: 'nuevo', component: Resenaregistrar, canActivate: [seguridadGuard] }, 
    { path: ':id', component: Resenaregistrar, canActivate: [seguridadGuard] },   
  ],
},

{
  path: 'promociones', 
  component: Promociones,
  children: [
    { path: '', component: Promocioneslistar, canActivate: [seguridadGuard] },          
    { path: 'nuevo', component: Promocionesregistrar , canActivate: [seguridadGuard]}, 
    { path: ':id', component: Promocionesregistrar , canActivate: [seguridadGuard]},   
  ],
},
{
    path: 'plato', 
    component: Plato,
    children: [
      { path: '', component: Platolistar , canActivate: [seguridadGuard]},         
      { path: 'nuevo', component: Platoregistrar , canActivate: [seguridadGuard]}, 
      { path: ':id', component: Platoregistrar, canActivate: [seguridadGuard] },   
    ],
  },

    {
    path: 'ingredientesplato', 
    component: Ingredientesplato,
    children: [
      { path: '', component: Ingredientesplatolistar, canActivate: [seguridadGuard] },         
      { path: 'nuevo', component: Ingredientesplatoregistrar, canActivate: [seguridadGuard] }, 
      { path: ':id', component: Ingredientesplatoregistrar , canActivate: [seguridadGuard]},   
    ],
  },
  {
    path: 'homes',
    component: Home,
        canActivate: [seguridadGuard],

  },
  {
    path:'reportecantidad',component:Reporteporcentajeusuario
  },
];
