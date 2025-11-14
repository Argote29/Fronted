import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Plato } from '../models/plato';


const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class ServicePlato implements OnInit {
   private url = `${base_url}/plato`;
    private listaCambio = new Subject<Plato[]>();

    constructor(private http: HttpClient) {}
  ngOnInit(): void {}


    list(): Observable<Plato[]> {
      return this.http.get<Plato[]>(this.url);
    }
  
    insert(r: Plato): Observable<string> {
      // Ya viene con la fecha correcta desde el modelo
      return this.http.post(this.url, r, { responseType: 'text' });
    }
  
    setList(listaNueva: Plato[]) {
      this.listaCambio.next(listaNueva);
    }
  
    getList() {
      return this.listaCambio.asObservable();
    }
  
    listId(id: number): Observable<Plato> {
      return this.http.get<Plato>(`${this.url}/${id}`);
    }
  
    update(r: Plato): Observable<string> {
      return this.http.put(`${this.url}`, r, { responseType: 'text' });
    }
  
    delete(id: number): Observable<string> {
      return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
    }
}
