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

export const routes: Routes = 
[

{path:'roles',component:Rol,
    children:[
        {path:'',component:Rollistar},
        {path:'nuevo',component:Rolregistrar},
        { path: ':id', component: Rolregistrar}
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
    { path: ':id', component: Restauranteregistrar},
  ]
},
{
  path: 'resena', 
  component: Resena,
  children: [
    { path: '', component: Resenalistar },          
    { path: 'nuevo', component: Resenaregistrar }, 
    { path: ':id', component: Resenaregistrar },   
  ],
},

{
  path: 'promociones', 
  component: Promociones,
  children: [
    { path: '', component: Promocioneslistar },          
    { path: 'nuevo', component: Promocionesregistrar }, 
    { path: ':id', component: Promocionesregistrar },   
  ],
},
{
    path: 'plato', 
    component: Plato,
    children: [
      { path: '', component: Platolistar },         
      { path: 'nuevo', component: Platoregistrar }, 
      { path: ':id', component: Platoregistrar },   
    ],
  },

    {
    path: 'ingredientesplato', 
    component: Ingredientesplato,
    children: [
      { path: '', component: Ingredientesplatolistar },         
      { path: 'nuevo', component: Ingredientesplatoregistrar }, 
      { path: ':id', component: Ingredientesplatoregistrar },   
    ],
  },
];
