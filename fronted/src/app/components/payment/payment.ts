import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PaymentService, PaymentType, SimulatedPaymentResult } from '../../services/payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
    imports: [CommonModule,ReactiveFormsModule], 
  styleUrls: ['./payment.css'],
  standalone: true // Asumo que se debe usar standalone si no usa module
})
export class PaymentComponent implements OnInit {
  
  paymentForm!: FormGroup;
  isProcessing: boolean = false;
  paymentResult: SimulatedPaymentResult | null = null; 
  errorMessage: string | null = null;

  // 🔑 Opciones para el select
  paymentOptions: { type: PaymentType, label: string }[] = [
    { type: 'RESERVA', label: 'Pago de Reserva' },
    { type: 'SUSCRIPCION', label: 'Pago de Suscripción' }
  ];

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
      // 🔑 NUEVO CAMPO AÑADIDO
      paymentType: [this.paymentOptions[0].type, Validators.required],
      
      cardNumber: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{16}$'),
      ]],
      cardName: ['', Validators.required],
      expiryDate: ['', [
        Validators.required, 
        Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')
      ]],
      cvv: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{3,4}$'),
        Validators.minLength(3),
        Validators.maxLength(4)
      ]],
      amount: [100.00, [ // Valor por defecto
        Validators.required, 
        Validators.min(1)
      ]]
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.paymentResult = null;
    this.errorMessage = null;

    const dataToSend = this.paymentForm.value;

    this.paymentService.processPayment(dataToSend)
      .subscribe({
        next: (response: SimulatedPaymentResult) => { 
          this.paymentResult = response;
        },
        error: (err: Error) => {
          this.errorMessage = err.message || 'Error desconocido durante la simulación.';
          console.error(err);
        },
        complete: () => {
          this.isProcessing = false;
        }
      });
  }
}