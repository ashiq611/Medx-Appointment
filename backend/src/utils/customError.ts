class CustomError extends Error {
    constructor(
        public messageCode: string,
        public error?: unknown,
        public statusCode?: number,
        public traceId?: string
    ) {
        super(messageCode);

        if (this.error instanceof Error) {
            this.error = this.error.message;
        }

        if (this.error instanceof Error) {
            if (process.env.NODE_ENV !== 'development') {
                this.stack = this.error.stack; // Remove stack trace in production
            } else {
                delete this.error.stack; // Remove stack trace in non-production
            }
        }
    }

    serializeErrors(): {
        messageCode: string;
        error: unknown;
        traceId?: string;
        stack?: string;
    } {
        return {
            messageCode: this.messageCode,
            error: this.error,
            traceId: this.traceId,
            stack: this.stack,
        };
    }
}

export default CustomError;
