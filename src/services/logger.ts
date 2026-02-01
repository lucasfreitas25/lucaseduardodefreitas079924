/**
 * Log levels supported by the application
 */
export const LogLevel = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

/**
 * Interface for the logger service
 */
interface LoggerService {
    log(message: string, level?: LogLevel, context?: Record<string, any>): void;
    error(error: Error, context?: Record<string, any>): void;
}

/**
 * Implementation of the logger service
 * In a real-world scenario, this would integrate with Sentry, LogRocket, or similar services.
 */
class Logger implements LoggerService {
    private isProduction: boolean = import.meta.env.PROD;

    /**
     * Logs a message with a specific level
     */
    log(message: string, level: LogLevel = LogLevel.INFO, context?: Record<string, any>) {
        if (this.isProduction) {
            // TODO: Send to external logging service (e.g., Sentry.captureMessage)
            // console.log(`[PROD LOG]: ${message}`, context); 
        } else {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`, context || '');
        }
    }

    /**
     * Logs an error with stack trace and context
     */
    error(error: Error, context?: Record<string, any>) {
        if (this.isProduction) {
            // TODO: Send to external logging service (e.g., Sentry.captureException)
            // Sentry.captureException(error, { extra: context });
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
