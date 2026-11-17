import { Injectable, isDevMode } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogDetails {
  code?: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  code?: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly isDevelopment = isDevMode();

  debug(message: string, details?: LogDetails): void {
    if (this.isDevelopment) {
      this.writeLog('debug', message, details);
    }
  }

  info(message: string, details?: LogDetails): void {
    this.writeLog('info', message, details);
  }

  warn(message: string, details?: LogDetails): void {
    this.writeLog('warn', message, details);
  }

  error(message: string, details?: LogDetails): void {
    this.writeLog('error', message, details);
  }

  private writeLog(
    level: LogLevel,
    message: string,
    details?: LogDetails
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message
    };

    if (details?.code !== undefined) {
      logEntry.code = details.code;
    }

    if (details?.context !== undefined) {
      logEntry.context = details.context;
    }

    if (details?.error !== undefined) {
      logEntry.error = details.error;
    }

    switch (level) {
      case 'debug':
        console.debug('[MFE-AUTH]', logEntry);
        break;

      case 'info':
        console.info('[MFE-AUTH]', logEntry);
        break;

      case 'warn':
        console.warn('[MFE-AUTH]', logEntry);
        break;

      case 'error':
        console.error('[MFE-AUTH]', logEntry);
        break;
    }
  }
}
