import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader, IDecodedToken } from '../utils/jwt';
import User, { UserRole } from '../models/User';
import AuditLog, { AuditAction, AuditEntity } from '../models/AuditLog';

// Extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: IDecodedToken;
      userId?: string;
      userRole?: string;
      companyId?: string;
    }
  }
}

// Middleware de autenticación
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de autenticación no proporcionado',
      });
      return;
    }
    
    const decoded = verifyAccessToken(token);
    
    // Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId).select('isActive role');
    
    if (!user || !user.isActive) {
      // Registrar intento de acceso con usuario inactivo
      await AuditLog.createLog({
        actorId: decoded.userId as any,
        actorEmail: decoded.email,
        actorRole: decoded.role,
        actorIp: req.ip,
        actorUserAgent: req.headers['user-agent'],
        action: AuditAction.ACCESS_DENIED,
        entity: AuditEntity.USER,
        entityId: decoded.userId,
        result: 'FAILURE',
        errorMessage: 'Usuario inactivo o no encontrado',
        timestamp: new Date(),
      });
      
      res.status(401).json({
        success: false,
        message: 'Usuario no autorizado',
      });
      return;
    }
    
    // Agregar información del usuario al request
    req.user = decoded;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.companyId = decoded.companyId;
    
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Token inválido',
    });
  }
};

// Middleware de autorización por roles
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.userRole) {
      res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
      return;
    }
    
    // Admin tiene acceso a todo
    if (req.userRole === UserRole.ADMIN) {
      next();
      return;
    }
    
    // Verificar si el rol del usuario está en los roles permitidos
    if (!allowedRoles.includes(req.userRole as UserRole)) {
      // Registrar intento de acceso no autorizado
      AuditLog.createLog({
        actorId: req.userId as any,
        actorEmail: req.user.email,
        actorRole: req.userRole,
        actorIp: req.ip,
        actorUserAgent: req.headers['user-agent'],
        action: AuditAction.ACCESS_DENIED,
        entity: AuditEntity.SYSTEM_CONFIG,
        entityDescription: `Intento de acceso a recurso restringido: ${req.originalUrl}`,
        result: 'FAILURE',
        errorMessage: `Rol ${req.userRole} no autorizado. Roles permitidos: ${allowedRoles.join(', ')}`,
        metadata: {
          apiEndpoint: req.originalUrl,
          httpMethod: req.method as any,
        },
        timestamp: new Date(),
      });
      
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
      });
      return;
    }
    
    next();
  };
};

// Middleware para verificar permisos específicos
export const checkPermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
      return;
    }
    
    // Admin tiene todos los permisos
    if (req.userRole === UserRole.ADMIN) {
      next();
      return;
    }
    
    // Verificar si el usuario tiene el permiso específico
    if (!req.user.permissions || !req.user.permissions.includes(requiredPermission)) {
      res.status(403).json({
        success: false,
        message: `Permiso '${requiredPermission}' requerido`,
      });
      return;
    }
    
    next();
  };
};

// Middleware para verificar acceso a recursos de empresa
export const checkCompanyAccess = (paramName: string = 'companyId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
      return;
    }
    
    // Admin y roles internos tienen acceso a todas las empresas
    const internalRoles = [
      UserRole.ADMIN,
      UserRole.GERENCIA,
      UserRole.MEDICO,
      UserRole.RECEPCION,
      UserRole.LABORATORIO,
      UserRole.FACTURACION,
    ];
    
    if (internalRoles.includes(req.userRole as UserRole)) {
      next();
      return;
    }
    
    // Para usuarios de empresa, verificar que solo accedan a su empresa
    if (req.userRole === UserRole.EMPRESA_RRHH) {
      const requestedCompanyId = req.params[paramName] || req.body.companyId || req.query.companyId;
      
      if (requestedCompanyId && requestedCompanyId !== req.companyId) {
        res.status(403).json({
          success: false,
          message: 'No tienes acceso a los recursos de esta empresa',
        });
        return;
      }
    }
    
    next();
  };
};

// Middleware para verificar acceso a datos de paciente
export const checkPatientAccess = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
      return;
    }
    
    // Roles que pueden acceder a todos los pacientes
    const fullAccessRoles = [
      UserRole.ADMIN,
      UserRole.MEDICO,
      UserRole.RECEPCION,
      UserRole.LABORATORIO,
    ];
    
    if (fullAccessRoles.includes(req.userRole as UserRole)) {
      next();
      return;
    }
    
    // Usuarios de empresa solo pueden ver pacientes de su empresa
    if (req.userRole === UserRole.EMPRESA_RRHH) {
      // La verificación específica se hace en el controlador
      next();
      return;
    }
    
    // Pacientes solo pueden ver sus propios datos
    if (req.userRole === UserRole.PACIENTE) {
      // La verificación específica se hace en el controlador
      next();
      return;
    }
    
    res.status(403).json({
      success: false,
      message: 'No tienes acceso a los datos de pacientes',
    });
  };
};

// Middleware para rate limiting por rol
export const roleBasedRateLimit = () => {
  const limits: Record<string, number> = {
    [UserRole.ADMIN]: 1000,
    [UserRole.GERENCIA]: 500,
    [UserRole.MEDICO]: 300,
    [UserRole.RECEPCION]: 300,
    [UserRole.LABORATORIO]: 300,
    [UserRole.FACTURACION]: 200,
    [UserRole.EMPRESA_RRHH]: 100,
    [UserRole.PACIENTE]: 50,
  };
  
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userId) {
      next();
      return;
    }
    
    const key = req.userId;
    const limit = limits[req.userRole as UserRole] || 50;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    
    const userRequests = requests.get(key);
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }
    
    if (userRequests.count >= limit) {
      res.status(429).json({
        success: false,
        message: 'Demasiadas solicitudes. Por favor intenta más tarde.',
        retryAfter: Math.ceil((userRequests.resetTime - now) / 1000),
      });
      return;
    }
    
    userRequests.count++;
    next();
  };
};