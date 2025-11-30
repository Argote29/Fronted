import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// NUEVO: Definición del tipo de pago
export type PaymentType = 'RESERVA' | 'SUSCRIPCION';

export interface SimulatedPaymentResult {
  success: boolean;
  message: string;
  transactionId: string;
  amount: number;
  //  Añadir el tipo de pago al resultado
  paymentType: PaymentType; 
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  cardName: string;
  //  NUEVO CAMPO
  paymentType: PaymentType; 
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  /**
   * Valida si la tarjeta ha expirado.
   */
  private isCardExpired(expiryDate: string): boolean {
    const parts = expiryDate.split('/');
    if (parts.length !== 2) return true;
    
    const expirationMonth = parseInt(parts[0], 10);
    const expirationYear = 2000 + parseInt(parts[1], 10);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (expirationYear < currentYear) {
      return true;
    }

    if (expirationYear === currentYear) {
      if (expirationMonth <= currentMonth) {
        return true;
      }
    }

    return false;
  }

  /**
   * Simula la llamada a una API de pago.
   */
  processPayment(data: PaymentData): Observable<SimulatedPaymentResult> {
    const SIMULATED_DELAY_MS = 1500;
    
    // 1. Validación de Expiración
    if (this.isCardExpired(data.expiryDate)) {
        return throwError(() => new Error('Error 400: La tarjeta de crédito ha expirado.'));
    }

    const cardNumber = data.cardNumber.replace(/\s/g, ''); 
    const lastDigit = parseInt(cardNumber.slice(-1));
    
    let response: SimulatedPaymentResult;
    
    // Texto adicional para el mensaje basado en el tipo de pago
    const typeLabel = data.paymentType === 'RESERVA' ? 'Reserva' : 'Suscripción';

    // 2. Lógica de Rechazo/Aprobación
    if (lastDigit === 0) {
      response = {
        success: false,
        message: `🚫 Pago de ${typeLabel} de \$${data.amount.toFixed(2)} rechazado. (Error 402)`,
        transactionId: 'SIM_R-' + Date.now(),
        amount: data.amount,
        paymentType: data.paymentType // Devolver el tipo
      };
      
    } else {
      response = {
        success: true,
        message: `✅ Pago de ${typeLabel} de \$${data.amount.toFixed(2)} APROBADO con éxito.`,
        transactionId: 'SIM_A-' + Date.now(),
        amount: data.amount,
        paymentType: data.paymentType // Devolver el tipo
      };
    }
    
    // 3. Devolver el resultado con retraso simulado
    return of(response).pipe(
      delay(SIMULATED_DELAY_MS)
    );
  }
}