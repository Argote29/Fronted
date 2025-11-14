import { Promociones } from "./promociones";
import { Restaurante } from "./Restaurante";

export class Plato {
  id_plato: number = 0;
  precio_plato: number = 0;
  nombre_plato: string = "";
  info_nutricional: string = "";

  ingredientesIds: number[] = []; 

  restaurante: Restaurante = new Restaurante();
  promociones: Promociones = new Promociones();
}
