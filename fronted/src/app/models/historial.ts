import { Usuario } from "./usuario"

export class Historial{
    id_historial:number=0
    fecha_inicio_sub:Date= new Date()
    fecha_final_sub:Date= new Date()
    estado:string=""
    usuario:Usuario=new Usuario()
}
