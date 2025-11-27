import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Ingredientesplato } from '../models/ingredientesplato';


const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ServiceIngredientesplato implements OnInit {
  private url = `${base_url}/ingrediente-plato`;
  private listaCambio = new Subject<Ingredientesplato[]>();

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}

 
  list(): Observable<Ingredientesplato[]> {
    return this.http.get<Ingredientesplato[]>(this.url);
  }

  insert(rP: Ingredientesplato): Observable<string> {
   
    return this.http.post(this.url, rP, { responseType: 'text' });
  }

  setList(listaNueva: Ingredientesplato[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number): Observable<Ingredientesplato> {
    return this.http.get<Ingredientesplato>(`${this.url}/${id}`);
  }

  update(rP: Ingredientesplato): Observable<string> {
    return this.http.put(`${this.url}`, rP, { responseType: 'text' });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}