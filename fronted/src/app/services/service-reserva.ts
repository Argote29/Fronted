import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { Observable, Subject } from 'rxjs';
import { Reserva } from '../models/Reserva';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ServiceReserva implements OnInit {
  private url = `${base_url}/reserva`;
  private listaCambio = new Subject<Reserva[]>();

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}

 
  list(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.url);
  }

  insert(r: Reserva): Observable<string> {
   
    return this.http.post(this.url, r, { responseType: 'text' });
  }

  setList(listaNueva: Reserva[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.url}/${id}`);
  }

  update(r: Reserva): Observable<string> {
    return this.http.put(`${this.url}`, r, { responseType: 'text' });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}