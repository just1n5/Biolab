import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Middleware para validar request con Zod
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar el body, query y params
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Reemplazar con datos validados
      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors,
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Error en la validación',
      });
    }
  };
};

// Middleware para validar solo el body
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          success: false,
          message: 'Errores de validación en el cuerpo de la petición',
          errors,
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Error en la validación',
      });
    }
  };
};

// Middleware para validar solo params
export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.params);
      req.params = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          success: false,
          message: 'Errores de validación en los parámetros',
          errors,
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Error en la validación',
      });
    }
  };
};

// Middleware para validar solo query
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          success: false,
          message: 'Errores de validación en los parámetros de consulta',
          errors,
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Error en la validación',
      });
    }
  };
};

// Middleware para sanitizar entrada
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
      if (typeof obj === 'string') {
        // Remover caracteres peligrosos y scripts
        return obj
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => sanitize(item));
    }
    
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Evitar prototype pollution
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue;
        }
        sanitized[key] = sanitize(obj[key]);
      }
    }
    
    return sanitized;
  };
  
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  
  next();
};

// Middleware para validar ObjectId de MongoDB
export const validateMongoId = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: `${paramName} es requerido`,
      });
      return;
    }
    
    // Validar formato de ObjectId de MongoDB (24 caracteres hexadecimales)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({
        success: false,
        message: `${paramName} no es un ID válido`,
      });
      return;
    }
    
    next();
  };
};

// Middleware para validar fechas
export const validateDateRange = (startField: string = 'startDate', endField: string = 'endDate') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startDate = req.query[startField] || req.body[startField];
    const endDate = req.query[endField] || req.body[endField];
    
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Formato de fecha inválido',
        });
        return;
      }
      
      if (start > end) {
        res.status(400).json({
          success: false,
          message: 'La fecha inicial no puede ser mayor que la fecha final',
        });
        return;
      }
      
      // Limitar rango máximo a 1 año
      const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 año en milisegundos
      if (end.getTime() - start.getTime() > maxRange) {
        res.status(400).json({
          success: false,
          message: 'El rango de fechas no puede exceder 1 año',
        });
        return;
      }
    }
    
    next();
  };
};

// Middleware para validar paginación
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const maxLimit = parseInt(process.env.MAX_PAGE_SIZE || '100');
  
  if (page < 1) {
    res.status(400).json({
      success: false,
      message: 'El número de página debe ser mayor a 0',
    });
    return;
  }
  
  if (limit < 1 || limit > maxLimit) {
    res.status(400).json({
      success: false,
      message: `El límite debe estar entre 1 y ${maxLimit}`,
    });
    return;
  }
  
  // Agregar valores validados al request
  req.query.page = page.toString();
  req.query.limit = limit.toString();
  req.query.skip = ((page - 1) * limit).toString();
  
  next();
};