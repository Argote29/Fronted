import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JwtRequestDTO } from '../../models/jwtRequestDTO';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-autenticador',
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './autenticador.html',
  styleUrl: './autenticador.css',
})
export class Autenticador implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  correo: string = '';
  contrasena: string = '';
  mensaje: string = '';
  ngOnInit(): void {}
  login() {
    let request = new JwtRequestDTO();
    request.correo = this.correo;
    request.contrasena = this.contrasena;
    this.loginService.login(request).subscribe(
      (data: any) => {
        sessionStorage.setItem('token', data.jwttoken);
        this.router.navigate(['homes']);
      },
      (error) => {
        this.mensaje = 'Credenciales incorrectas!!!';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      }
    );
  }
}
