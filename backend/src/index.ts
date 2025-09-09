import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';

// Importar configuraciones y utilidades
import connectDB from './config/database';
import logger, { stream, logInfo, logError } from './utils/logger';
import { sanitizeInput } from './middleware/validation';

// Importar rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import companyRoutes from './routes/company.routes';
import patientRoutes from './routes/patient.routes';
import appointmentRoutes from './routes/appointment.routes';
import clinicalRecordRoutes from './routes/clinicalRecord.routes';
import certificateRoutes from './routes/certificate.routes';
import invoiceRoutes from './routes/invoice.routes';
import profesiogramRoutes from './routes/profesiogram.routes';
import labRoutes from './routes/lab.routes';
import reportRoutes from './routes/report.routes';
import dashboardRoutes from './routes/dashboard.routes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Application = express();

// Conectar a MongoDB
connectDB();

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration - MÁS PERMISIVO PARA DESARROLLO
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // En desarrollo, permitir cualquier origen
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }
    
    // En producción, usar lista blanca
    const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'];
    
    // Permitir requests sin origin (ej: Postman, aplicaciones móviles)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Manejar preflight requests
app.options('*', cors(corsOptions));

// Compresión de respuestas
app.use(compression());

// Parser de JSON y URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitizar todas las entradas
app.use(sanitizeInput);

// Logger de HTTP requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream }));
}

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // límite de requests
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Saltar rate limiting en desarrollo
    return process.env.NODE_ENV === 'development';
  }
});

app.use('/api/', globalLimiter);

// Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // Más permisivo en desarrollo
  message: 'Demasiados intentos de inicio de sesión, por favor intenta más tarde.',
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Servir archivos estáticos (para archivos subidos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinical-records', clinicalRecordRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/profesiograms', profesiogramRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de BIOLAB Integral',
    version: '1.0.0',
    documentation: '/api/docs',
    environment: process.env.NODE_ENV,
  });
});

// Test endpoint para verificar conexión
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use('*', (req: Request, res: Response) => {
  console.log('404 - Ruta no encontrada:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado',
    path: req.originalUrl,
  });
});

// Middleware de manejo de errores global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logError('Error no manejado', err);
  console.error('Error:', err);
  
  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }
  
  // Error de duplicado en MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `El ${field} ya está registrado`,
    });
  }
  
  // Error de CORS
  if (err.message === 'No permitido por CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origen no permitido por CORS',
    });
  }
  
  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }
  
  // Error por defecto
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    }),
  });
});

// Puerto y arranque del servidor
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logInfo(`🚀 Servidor corriendo en puerto ${PORT}`);
  logInfo(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logInfo(`🔗 URL: http://localhost:${PORT}`);
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🚀 BIOLAB Backend Server                ║
║                                           ║
║   Puerto: ${PORT}                            ║
║   Ambiente: ${process.env.NODE_ENV || 'development'}              ║
║   URL: http://localhost:${PORT}              ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  logInfo('SIGTERM recibido. Cerrando servidor gracefully...');
  server.close(() => {
    logInfo('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logInfo('SIGINT recibido. Cerrando servidor gracefully...');
  server.close(() => {
    logInfo('Servidor cerrado');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  logError('Error no capturado:', err);
  console.error('Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError('Promesa rechazada no manejada:', reason);
  console.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

export default app;