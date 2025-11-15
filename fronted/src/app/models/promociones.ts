import { Restaurante } from "./Restaurante"

export class Promociones {
    id_Promociones:number=0
    descripcion:string=""
    fecha_inico_promo: Date= new Date()
    fecha_final_promo:Date = new Date()
    descuento:string=""
    restaurante:Restaurante= new Restaurante()

}