// Error logging utility for frontend and backend error tracking

export interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    sessionId?: string;
    url?: string;
    userAgent?: string;
    [key: string]: any;
  };
}

class ErrorLogger {
  private sessionId: string;
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING === 'true';
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(level: ErrorLog['level'], message: string, context?: ErrorLog['context']): ErrorLog {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      stack: level === 'error' ? new Error().stack : undefined,
      context: {
        sessionId: this.sessionId,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...context,
      },
    };
  }

  private async sendLog(log: ErrorLog): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // In production, send to your logging service
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Integration with Sentry would go here
        console.log('Would send to Sentry:', log);
      }

      // For now, log to console and local storage for debugging
      console.error(`[${log.level.toUpperCase()}] ${log.message}`, log);

      // Store in localStorage for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        existingLogs.push(log);
        
        // Keep only last 100 logs to prevent storage overflow
        if (existingLogs.length > 100) {
          existingLogs.splice(0, existingLogs.length - 100);
        }
        
        localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
      }
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  }

  async error(message: string, context?: ErrorLog['context']): Promise<void> {
    const log = this.createLogEntry('error', message, context);
    await this.sendLog(log);
  }

  async warning(message: string, context?: ErrorLog['context']): Promise<void> {
    const log = this.createLogEntry('warning', message, context);
    await this.sendLog(log);
  }

  async info(message: string, context?: ErrorLog['context']): Promise<void> {
    const log = this.createLogEntry('info', message, context);
    await this.sendLog(log);
  }

  // Log API errors with detailed context
  async logApiError(error: any, endpoint: string, method: string, requestData?: any): Promise<void> {
    const context = {
      component: 'API',
      action: `${method} ${endpoint}`,
      endpoint,
      method,
      requestData: requestData ? JSON.stringify(requestData) : undefined,
      statusCode: error?.status,
      errorData: error?.data ? JSON.stringify(error.data) : undefined,
    };

    const message = `API Error: ${method} ${endpoint} - ${error?.message || 'Unknown error'}`;
    await this.error(message, context);
  }

  // Log Redux action errors
  async logReduxError(error: any, actionType: string, payload?: any): Promise<void> {
    const context = {
      component: 'Redux',
      action: actionType,
      payload: payload ? JSON.stringify(payload) : undefined,
    };

    const message = `Redux Error: ${actionType} - ${error?.message || 'Unknown error'}`;
    await this.error(message, context);
  }

  // Log component errors
  async logComponentError(error: Error, componentName: string, props?: any): Promise<void> {
    const context = {
      component: componentName,
      props: props ? JSON.stringify(props) : undefined,
      stack: error.stack,
    };

    const message = `Component Error: ${componentName} - ${error.message}`;
    await this.error(message, context);
  }

  // Get stored logs (for debugging)
  getStoredLogs(): ErrorLog[] {
    if (process.env.NODE_ENV === 'development') {
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    }
    return [];
  }

  // Clear stored logs
  clearStoredLogs(): void {
    if (process.env.NODE_ENV === 'development') {
      localStorage.removeItem('errorLogs');
    }
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

// React Error Boundary helper
export const logErrorBoundary = (error: Error, errorInfo: React.ErrorInfo, componentName: string) => {
  errorLogger.logComponentError(error, componentName, {
    componentStack: errorInfo.componentStack,
  });
};

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.error('Unhandled Promise Rejection', {
      reason: event.reason,
      type: 'unhandledRejection',
    });
  });

  window.addEventListener('error', (event) => {
    errorLogger.logComponentError(event.error, 'GlobalErrorHandler', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
}
