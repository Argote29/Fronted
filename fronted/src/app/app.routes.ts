import { Routes } from '@angular/router';
import { Rol } from './components/rol/rol';
import { Rolregistrar } from './components/rol/rolregistrar/rolregistrar';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioregistrarComponent } from './components/usuario/usuarioregistrar/usuarioregistrar.component';
import { UsuariolistarComponent } from './components/usuario/usuariolistar/usuariolistar.component';
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
}
];
