import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { Ingrediente } from '../models/ingrediente';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ServiceIngrediente implements OnInit{
    
  private url = `${base_url}/ingredientes`

  private listaCambio = new Subject<Ingrediente[]>();
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

   list() {
      return this.http.get<Ingrediente[]>(this.url);
    }

   insert(i: Ingrediente): Observable<string> {
       return this.http.post(this.url, i, { responseType: 'text' });
     }
   
    setList(listaNueva: Ingrediente[]) {
       this.listaCambio.next(listaNueva);
     }
    getList() {
       return this.listaCambio.asObservable();
     }
   
    listId(id: number) {
       return this.http.get<Ingrediente>(`${this.url}/${id}`);
     }
     
    update(i: Ingrediente) {
       return this.http.put(`${this.url}`, i, { responseType: 'text' });
     }
   
    delete(id: number) {
       return this.http.delete(`${this.url}/${id}`,{ responseType: 'text' })
     } 
}
