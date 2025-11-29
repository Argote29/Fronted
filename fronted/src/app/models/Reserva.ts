import { Restaurante } from "./Restaurante";
import { Usuario } from "./usuario";

export class Reserva{
    id_reserva:number = 0;
    fecha_reserva:Date = new Date();
    hora:string ="";
    numero_personas:number=0;
    estado:string="";
    usuario:Usuario=new Usuario();
    restaurante:Restaurante=new Restaurante
}