
import { Plato } from "./plato";
import { Ingrediente } from "./ingrediente";

export class Ingredientesplato {
  nombre_ingrediente: string = "";
  cantidad: number = 0;
  tipo_unidad: string = ""; 
  plato: Plato = new Plato()
  ingrediente: Ingrediente = new Ingrediente()
}