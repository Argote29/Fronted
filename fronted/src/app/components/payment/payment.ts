import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService, SimulatedPaymentResult } from '../../services/payment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// 🔑 Importamos el servicio y el nuevo nombre de la interfaz

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
    imports: [CommonModule,ReactiveFormsModule],
  styleUrls: ['./payment.css']
})
export class PaymentComponent implements OnInit {
  
  paymentForm!: FormGroup;
  isProcessing: boolean = false;
  // 🔑 Usamos la interfaz renombrada
  paymentResult: SimulatedPaymentResult | null = null; 
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,   
     private router: Router,
  ) { }
 irAInicio() {
  this.router.navigate(['/homes']);
}
  ngOnInit(): void {
    // Inicialización del formulario reactivo con todas las validaciones
    this.paymentForm = this.fb.group({
      cardNumber: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{16}$'), // 16 dígitos
      ]],
      cardName: ['', Validators.required],
      expiryDate: ['', [
        Validators.required, 
        Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$') // MM/AA (ej: 12/26)
      ]],
      cvv: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{3,4}$'), // 3 o 4 dígitos
        Validators.minLength(3),
        Validators.maxLength(4)
      ]],
      amount: [100.00, [
        Validators.required, 
        Validators.min(1)
      ]]
    });
  }

  onSubmit(): void {
    // Si el formulario no es válido, detenemos el proceso
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.paymentResult = null;
    this.errorMessage = null;

    // Enviar todos los datos necesarios al servicio
    const dataToSend = this.paymentForm.value;

    // 4. Llamar al servicio de simulación
    this.paymentService.processPayment(dataToSend)
      .subscribe({
        // 🔑 Usamos el tipo renombrado aquí
        next: (response: SimulatedPaymentResult) => { 
          this.paymentResult = response;
        },
        error: (err: Error) => {
          // Captura el error de expiración de la tarjeta (throwError)
          this.errorMessage = err.message || 'Error desconocido durante la simulación.';
          console.error(err);
        },
        complete: () => {
          this.isProcessing = false;
        }
      });
  }
}