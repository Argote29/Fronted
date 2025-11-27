
import { Restaurante } from "./Restaurante";
import { Usuario } from "./usuario";

export class Resena {
  id_resena: number = 0;
  comentario: string = "";
  calificacion: number = 0;
  fecha_resena: string = new Date().toLocaleDateString('en-CA'); 
  restaurante: Restaurante = new Restaurante()
  usuario: Usuario = new Usuario()
}