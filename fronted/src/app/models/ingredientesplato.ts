
import { Plato } from "./plato";
import { Ingrediente } from "./ingrediente";

export class Ingredientesplato {
  idIngredientePlato: number = 0;
  cantidad: number = 0;
  tipo_unidad: string = ""; 
  plato: Plato = new Plato()
  ingredientes: Ingrediente = new Ingrediente()
}