import { Restaurante } from "./Restaurante"

export class Promociones {
    id_Promociones:number=0
    descripcion:string=""
    fecha_inico_promo:string = new Date().toLocaleDateString('en-CA')
    fecha_final_promo:string = new Date().toLocaleDateString('en-CA')
    descuento:string=""
    restaurante:Restaurante= new Restaurante()

}