import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { Historial } from '../models/historial';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { QuerySuscripcionActiva } from '../models/QuerySuscripcionActiva';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})

export class ServiceHistorial implements OnInit {
  
  private url = `${base_url}/historialSuscripcion`

  private listaCambio = new Subject<Historial[]>();
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
  
     list() {
        return this.http.get<Historial[]>(this.url);
      }
  
     insert(h: Historial): Observable<string> {
         return this.http.post(this.url, h, { responseType: 'text' });
       }
     
      setList(listaNueva: Historial[]) {
         this.listaCambio.next(listaNueva);
       }
      getList() {
         return this.listaCambio.asObservable();
       }
     
      listId(id: number) {
         return this.http.get<Historial>(`${this.url}/${id}`);
       }
       
      update(h: Historial) {
        return this.http.put(`${this.url}`, h, { responseType: 'text' });
      }
      delete(id: number) {
         return this.http.delete(`${this.url}/${id}`,{ responseType: 'text' })
       } 
       getComparacionSuscripciones(): Observable<QuerySuscripcionActiva>{
         return this.http.get<QuerySuscripcionActiva>(`${this.url}/comparacion`);
       } 
}
