import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs'; 
import { JwtRequestDTO } from '../models/jwtRequestDTO';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  
  private http = inject(HttpClient);
  

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error al decodificar JWT:', e);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return false;
    }
    const expirationDate = new Date(0); 
    expirationDate.setUTCSeconds(decoded.exp); 
    return expirationDate.valueOf() < new Date().valueOf();
  }
  
  // ----------------------------------------------------
  
  private apiUrl = 'http://localhost:8080/login';
  private apiIdUrl = 'http://localhost:8080/usuarios/id-por-correo'; 

  login(request: JwtRequestDTO) {
    return this.http.post(this.apiUrl, request);
  }

  verificar(): boolean {
    let token = sessionStorage.getItem('token');
    if (token) {
      return !this.isTokenExpired(token);
    }
    return false;
  }

  showRole(): any {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }
    const decodedToken = this.decodeToken(token);
    return decodedToken?.roles; 
  }
  
  showIdUser(): number | string | null {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }
    const decodedToken = this.decodeToken(token);
    return decodedToken?.id_usuario || decodedToken?.sub; 
  }

  fetchUserIdByEmail(email: string): Observable<number> {
    const token = sessionStorage.getItem('token');

    if (!token) {
        // Si no hay token, fallamos inmediatamente
        return throwError(() => new Error('Token de autenticación no encontrado.'));
    }
    
    // 1. Crear encabezados y adjuntar el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 2. Ejecutar la llamada, pasando los encabezados
    return this.http.get<number>(`${this.apiIdUrl}?email=${email}`, { headers: headers });
  }
}