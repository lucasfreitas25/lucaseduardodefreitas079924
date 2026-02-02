// Niveis de log suportados pela aplicacao
export const LogLevel = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

// Interface do serviço de logging
interface LoggerService {
    log(message: string, level?: LogLevel, context?: Record<string, any>): void;
    error(error: Error, context?: Record<string, any>): void;
}

// Implementação do serviço de logging
class Logger implements LoggerService {
    private isProduction: boolean = import.meta.env.PROD;


    // Registra uma mensagem com um nivel especifico
    log(message: string, level: LogLevel = LogLevel.INFO, context?: Record<string, any>) {
        if (this.isProduction) {

        } else {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`, context || '');
        }
    }

    // Registra um erro com rastreio de pilha e contexto
    error(error: Error, context?: Record<string, any>) {
        if (this.isProduction) {
            console.error('[PROD ERROR REPORTED]:', error.message);
        } else {
            console.group('🚨 Application Error');
            console.error(error);
            if (context) {
                console.info('Context:', context);
            }
            console.groupEnd();
        }
    }
}

export const logger = new Logger();
