import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Resena } from '../models/resena';
import { QueryRestaurantesMasResenadosDTO } from '../models/queryRestaurantesMasResenadosDTO';


const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ServiceResena implements OnInit {
  private url = `${base_url}/resena`;
  private listaCambio = new Subject<Resena[]>();

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}


  list(): Observable<Resena[]> {
    return this.http.get<Resena[]>(this.url);
  }

  insert(r: Resena): Observable<string> {
   
    return this.http.post(this.url, r, { responseType: 'text' });
  }

  setList(listaNueva: Resena[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number): Observable<Resena> {
    return this.http.get<Resena>(`${this.url}/${id}`);
  }

  update(r: Resena): Observable<string> {
    return this.http.put(`${this.url}`, r, { responseType: 'text' });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
   getreporte1():Observable<QueryRestaurantesMasResenadosDTO[]>{
    return this.http.get<QueryRestaurantesMasResenadosDTO[]>(`${this.url}/mas-resenados`)
   }
}