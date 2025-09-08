import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Crear directorio de logs si no existe
const logDir = process.env.LOG_FILE_PATH || './logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Formato personalizado para los logs
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    
    return msg;
  })
);

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'biolab-backend' },
  transports: [
    // Escribir todos los logs con nivel 'error' y menor a error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Escribir todos los logs con nivel 'info' y menor a combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Logs de auditoría en archivo separado
    new winston.transports.File({
      filename: path.join(logDir, 'audit.log'),
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// Si no estamos en producción, también log a la consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          
          if (Object.keys(metadata).length > 0 && metadata.stack) {
            msg += `\n${metadata.stack}`;
          }
          
          return msg;
        })
      ),
    })
  );
}

// Crear stream para Morgan (HTTP request logger)
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Funciones helper para diferentes tipos de logs
export const logInfo = (message: string, metadata?: any): void => {
  logger.info(message, metadata);
};

export const logError = (message: string, error?: any): void => {
  logger.error(message, {
    error: error?.message || error,
    stack: error?.stack,
    ...error,
  });
};

export const logWarning = (message: string, metadata?: any): void => {
  logger.warn(message, metadata);
};

export const logDebug = (message: string, metadata?: any): void => {
  logger.debug(message, metadata);
};

export const logAudit = (action: string, user: string, details: any): void => {
  logger.info('AUDIT', {
    action,
    user,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

export const logPerformance = (operation: string, duration: number, metadata?: any): void => {
  logger.info('PERFORMANCE', {
    operation,
    duration: `${duration}ms`,
    ...metadata,
  });
};

export const logSecurity = (event: string, details: any): void => {
  logger.warn('SECURITY', {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

export default logger;