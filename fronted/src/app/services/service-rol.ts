import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { Rol } from '../models/rol';
import { Subject,Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RolService implements OnInit {
  private url = `${base_url}/roles`

  private listaCambio = new Subject<Rol[]>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
  
  list() {
    return this.http.get<Rol[]>(this.url);
  }

   insert(r: Rol): Observable<string> {
    return this.http.post(this.url, r, { responseType: 'text' });
  }

  setList(listaNueva: Rol[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }
  
  update(r: Rol) {
    return this.http.put(`${this.url}`, r, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`,{ responseType: 'text' })
  }
}
