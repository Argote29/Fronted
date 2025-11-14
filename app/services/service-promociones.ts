import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Promociones } from '../models/promociones';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ServicePromociones implements OnInit {
   private url = `${base_url}/promociones`;
    private listaCambio = new Subject<Promociones[]>();
  
    constructor(private http: HttpClient) {}
    ngOnInit(): void {}
  
   
    list(): Observable<Promociones[]> {
      return this.http.get<Promociones[]>(this.url);
    }
  
    insert(r: Promociones): Observable<string> {
     
      return this.http.post(this.url, r, { responseType: 'text' });
    }
  
    setList(listaNueva: Promociones[]) {
      this.listaCambio.next(listaNueva);
    }
  
    getList() {
      return this.listaCambio.asObservable();
    }
  
    listId(id: number): Observable<Promociones> {
      return this.http.get<Promociones>(`${this.url}/${id}`);
    }
  
    update(r: Promociones): Observable<string> {
      return this.http.put(`${this.url}`, r, { responseType: 'text' });
    }
  
    delete(id: number): Observable<string> {
      return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
    }
}
