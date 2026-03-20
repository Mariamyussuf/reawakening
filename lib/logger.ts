import winston from 'winston';

/**
 * Structured logging utility
 * Replaces console.error and console.log with structured logging
 */

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define log colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info;
        let log = `${timestamp} [${level}]: ${message}`;

        // Add metadata if present
        if (Object.keys(meta).length > 0 && meta.constructor === Object) {
            log += ` ${JSON.stringify(meta)}`;
        }

        return log;
    })
);

// Define transports
const transports = [
    // Console transport
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf((info) => {
                const { timestamp, level, message, ...meta } = info;
                let log = `${timestamp} [${level}]: ${message}`;

                if (Object.keys(meta).length > 0 && meta.constructor === Object) {
                    log += ` ${JSON.stringify(meta, null, 2)}`;
                }

                return log;
            })
        ),
    }),
];

// Create logger instance
export const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    format,
    transports,
    // Don't exit on handled exceptions
    exitOnError: false,
});

/**
 * Logging utility functions
 */
export const log = {
    /**
     * Log error
     */
    error: (message: string, error?: Error | unknown, meta?: Record<string, any>) => {
        const errorMeta: Record<string, any> = { ...meta };

        if (error instanceof Error) {
            errorMeta.error = {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        } else if (error) {
            errorMeta.error = error;
        }

        logger.error(message, errorMeta);
    },

    /**
     * Log warning
     */
    warn: (message: string, meta?: Record<string, any>) => {
        logger.warn(message, meta);
    },

    /**
     * Log info
     */
    info: (message: string, meta?: Record<string, any>) => {
        logger.info(message, meta);
    },

    /**
     * Log HTTP request
     */
    http: (message: string, meta?: Record<string, any>) => {
        logger.http(message, meta);
    },

    /**
     * Log debug (development only)
     */
    debug: (message: string, meta?: Record<string, any>) => {
        if (process.env.NODE_ENV !== 'production') {
            logger.debug(message, meta);
        }
    },
};

// Create a stream object for use with morgan (if needed)
export const stream = {
    write: (message: string) => {
        logger.http(message.trim());
    },
};
