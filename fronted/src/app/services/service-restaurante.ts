import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { Restaurante } from '../models/Restaurante';
import { Subject,Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QueryPromedioRestaurante } from '../models/QueryPromedioRestaurante';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RestauranteService implements OnInit {
  private url = `${base_url}/restaurante`

  private listaCambio = new Subject<Restaurante[]>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
  list() {
    return this.http.get<Restaurante[]>(this.url);
  }

   insert(rE: Restaurante): Observable<string> {
    return this.http.post(this.url, rE, { responseType: 'text' });
  }

  setList(listaNueva: Restaurante[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Restaurante>(`${this.url}/${id}`);
  }
  
  update(rE: Restaurante) {
    return this.http.put(`${this.url}`, rE, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`,{ responseType: 'text' })
  }

  getPromedioRestaurante(): Observable<QueryPromedioRestaurante[]>{
    return this.http.get<QueryPromedioRestaurante[]>(`${this.url}/restaurantePromedioResena`);
} 
}
