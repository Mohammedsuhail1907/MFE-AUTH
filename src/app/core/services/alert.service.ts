import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface AlertMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
  life?: number;
  key?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private messageService: MessageService) {}

  /**
   * Show a success message
   */
  showSuccess(detail: string, summary: string = 'Success', life: number = 3000): void {
    this.showMessage({
      severity: 'success',
      summary,
      detail,
      life
    });
  }

  /**
   * Show an info message
   */
  showInfo(detail: string, summary: string = 'Info', life: number = 3000): void {
    this.showMessage({
      severity: 'info',
      summary,
      detail,
      life
    });
  }

  /**
   * Show a warning message
   */
  showWarning(detail: string, summary: string = 'Warning', life: number = 5000): void {
    this.showMessage({
      severity: 'warn',
      summary,
      detail,
      life
    });
  }

  /**
   * Show an error message
   */
  showError(detail: string, summary: string = 'Error', life: number = 5000): void {
    this.showMessage({
      severity: 'error',
      summary,
      detail,
      life
    });
  }

  /**
   * Show a custom message
   */
  showMessage(message: AlertMessage): void {
    this.messageService.add(message);
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this.messageService.clear();
  }

  /**
   * Clear messages for a specific key
   */
  clearByKey(key: string): void {
    this.messageService.clear(key);
  }
} 