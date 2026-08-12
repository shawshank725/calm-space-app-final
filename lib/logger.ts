/**
 * Production-safe logger for Calm Space App
 * Prevents sensitive information from being logged in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private isDev = __DEV__;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Internal log formatter to sanitize data
   */
  private format(message: string, data?: any): string {
    let sanitizedData = '';
    if (data) {
      try {
        // Simple sanitization: remove common sensitive keys
        const sensitiveKeys = ['password', 'token', 'access_token', 'refresh_token', 'registration_number', 'phone_number', 'email'];
        const cleanData = JSON.parse(JSON.stringify(data), (key, value) => {
          return sensitiveKeys.includes(key.toLowerCase()) ? '[REDACTED]' : value;
        });
        sanitizedData = JSON.stringify(cleanData);
      } catch (e) {
        sanitizedData = '[Unserializable Data]';
      }
    }
    return `[CalmSpace] ${message} ${sanitizedData}`;
  }

  public debug(message: string, data?: any) {
    if (this.isDev) {
      console.log(this.format(message, data));
    }
  }

  public info(message: string, data?: any) {
    // Only log essential info in production
    console.log(this.format(message, data));
  }

  public warn(message: string, data?: any) {
    console.warn(this.format(message, data));
  }

  public error(message: string, error?: any) {
    console.error(this.format(message, error));
  }

  /**
   * Helper for sensitive operations (only logs in dev)
   */
  public sensitive(message: string, sensitiveData: any) {
    if (this.isDev) {
      console.log(this.format(`[SENSITIVE] ${message}`), sensitiveData);
    }
  }
}

export const logger = Logger.getInstance();
