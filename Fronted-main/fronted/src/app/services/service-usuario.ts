import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../enviroments/environment'; 
import { Usuario } from '../models/usuario';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ServiceUsuario implements OnInit {
  private url = `${base_url}/usuarios`;

  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  
  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  
  insert(u: Usuario): Observable<string> {
    return this.http.post(this.url, u, { responseType: 'text' });
  }

  
  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(): Observable<Usuario[]> {
    return this.listaCambio.asObservable();
  }

  
  listId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  
  update(u: Usuario): Observable<string> {
    return this.http.put(`${this.url}`, u, { responseType: 'text' });
  }

  
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}