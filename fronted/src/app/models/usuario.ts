import { Rol } from "./rol";

export class Usuario {
  id_usuario: number = 0;
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  contrasena: string = '';
  direccion: string = '';
  telefono: number = 0;
  genero: string = '';
  rol:Rol=new Rol()

}