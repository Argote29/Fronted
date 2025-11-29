import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interfaz para la respuesta simulada (nombre único para evitar conflictos)
export interface SimulatedPaymentResult {
  success: boolean;
  message: string;
  transactionId: string;
  amount: number;
}

// Interfaz para los datos que enviamos desde el formulario
export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  cardName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  /**
   * Valida si la tarjeta ha expirado.
   * @param expiryDate La fecha de caducidad en formato MM/AA.
   * @returns true si la tarjeta ha expirado, false en caso contrario.
   */
  private isCardExpired(expiryDate: string): boolean {
    const parts = expiryDate.split('/');
    if (parts.length !== 2) return true; // Formato inválido
    
    // Obtener mes y año de expiración
    const expirationMonth = parseInt(parts[0], 10);
    const expirationYear = 2000 + parseInt(parts[1], 10); // Asume años 2000+

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() es 0-indexado
    const currentYear = now.getFullYear();

    // 1. Si el año de expiración es menor al actual -> Expirado
    if (expirationYear < currentYear) {
      return true;
    }

    // 2. Si el año es el mismo, comparamos el mes
    if (expirationYear === currentYear) {
      // Si el mes de expiración es menor o igual al mes actual -> Expirado
      // Nota: Una tarjeta es válida HASTA el último día del mes de expiración.
      // Aquí simplificamos: mes actual o anterior = expirada.
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

    // 2. Lógica de Rechazo/Aprobación
    if (lastDigit === 0) {
      // Regla de Fallo: Último dígito es 0.
      response = {
        success: false,
        message: `🚫 Pago de \$${data.amount.toFixed(2)} rechazado. (Error 402)`,
        transactionId: 'SIM_R-' + Date.now(),
        amount: data.amount
      };
      
    } else {
      // Regla de Éxito: Último dígito diferente de 0.
      response = {
        success: true,
        message: `✅ Pago de \$${data.amount.toFixed(2)} APROBADO con éxito.`,
        transactionId: 'SIM_A-' + Date.now(),
        amount: data.amount
      };
    }
    
    // 3. Devolver el resultado con retraso simulado
    return of(response).pipe(
      delay(SIMULATED_DELAY_MS)
    );
  }
}