import { Schema, model, Document, Types } from 'mongoose';

// Enum de acciones auditables
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  PRINT = 'PRINT',
  DOWNLOAD = 'DOWNLOAD',
  SHARE = 'SHARE',
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SIGN = 'SIGN',
  GENERATE_REPORT = 'GENERATE_REPORT',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
}

// Enum de entidades del sistema
export enum AuditEntity {
  USER = 'User',
  PATIENT = 'Patient',
  COMPANY = 'Company',
  APPOINTMENT = 'Appointment',
  CLINICAL_RECORD = 'ClinicalRecord',
  LAB_SAMPLE = 'LabSample',
  CERTIFICATE = 'Certificate',
  INVOICE = 'Invoice',
  PROFESIOGRAM = 'Profesiogram',
  REPORT = 'Report',
  SYSTEM_CONFIG = 'SystemConfig',
}

// Interface para TypeScript
export interface IAuditLog extends Document {
  actorId: Types.ObjectId;
  actorEmail: string;
  actorRole: string;
  actorIp?: string;
  actorUserAgent?: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  entityDescription?: string;
  previousData?: any;
  newData?: any;
  changedFields?: string[];
  reason?: string;
  result: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
  metadata?: {
    sessionId?: string;
    requestId?: string;
    apiEndpoint?: string;
    httpMethod?: string;
    responseTime?: number;
    affectedRecords?: number;
  };
  timestamp: Date;
  isHighRisk: boolean;
  isSensitiveData: boolean;
  complianceFlags?: {
    isHIPAA?: boolean;
    isGDPR?: boolean;
    isHabeasData?: boolean;
  };
  retentionDate?: Date;
  isArchived: boolean;
  createdAt: Date;
}

// Schema de Mongoose
const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El actor es requerido'],
      index: true,
    },
    actorEmail: {
      type: String,
      required: [true, 'El email del actor es requerido'],
      index: true,
    },
    actorRole: {
      type: String,
      required: [true, 'El rol del actor es requerido'],
    },
    actorIp: {
      type: String,
      validate: {
        validator: function(v: string) {
          // Validación básica de IPv4 o IPv6
          return !v || /^(\d{1,3}\.){3}\d{1,3}$/.test(v) || /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/.test(v);
        },
        message: 'Formato de IP inválido',
      },
    },
    actorUserAgent: {
      type: String,
      maxlength: 500,
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: [true, 'La acción es requerida'],
      index: true,
    },
    entity: {
      type: String,
      enum: Object.values(AuditEntity),
      required: [true, 'La entidad es requerida'],
      index: true,
    },
    entityId: {
      type: String,
      index: true,
    },
    entityDescription: {
      type: String,
      maxlength: 500,
    },
    previousData: {
      type: Schema.Types.Mixed,
    },
    newData: {
      type: Schema.Types.Mixed,
    },
    changedFields: [String],
    reason: {
      type: String,
      maxlength: 1000,
    },
    result: {
      type: String,
      enum: ['SUCCESS', 'FAILURE'],
      required: [true, 'El resultado es requerido'],
      default: 'SUCCESS',
      index: true,
    },
    errorMessage: {
      type: String,
      maxlength: 1000,
    },
    metadata: {
      sessionId: String,
      requestId: String,
      apiEndpoint: String,
      httpMethod: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
      responseTime: Number,
      affectedRecords: Number,
    },
    timestamp: {
      type: Date,
      required: [true, 'La marca de tiempo es requerida'],
      default: Date.now,
      index: true,
    },
    isHighRisk: {
      type: Boolean,
      default: false,
      index: true,
    },
    isSensitiveData: {
      type: Boolean,
      default: false,
      index: true,
    },
    complianceFlags: {
      isHIPAA: Boolean,
      isGDPR: Boolean,
      isHabeasData: Boolean,
    },
    retentionDate: {
      type: Date,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false, // Los logs no se actualizan
    },
    versionKey: false,
  }
);

// Índices compuestos para optimización de consultas comunes
AuditLogSchema.index({ actorId: 1, timestamp: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, result: 1, timestamp: -1 });
AuditLogSchema.index({ isHighRisk: 1, timestamp: -1 });
AuditLogSchema.index({ retentionDate: 1, isArchived: 1 });

// Middleware para determinar si es data sensible o de alto riesgo
AuditLogSchema.pre('save', function(next) {
  // Determinar si es data sensible
  const sensitivEntities = [
    AuditEntity.PATIENT,
    AuditEntity.CLINICAL_RECORD,
    AuditEntity.LAB_SAMPLE,
    AuditEntity.CERTIFICATE,
  ];
  this.isSensitiveData = sensitivEntities.includes(this.entity as AuditEntity);
  
  // Determinar si es acción de alto riesgo
  const highRiskActions = [
    AuditAction.DELETE,
    AuditAction.PERMISSION_CHANGE,
    AuditAction.PASSWORD_CHANGE,
    AuditAction.EXPORT,
    AuditAction.SHARE,
  ];
  this.isHighRisk = highRiskActions.includes(this.action as AuditAction);
  
  // Establecer bandera de cumplimiento Habeas Data para Colombia
  if (this.isSensitiveData) {
    this.complianceFlags = {
      ...this.complianceFlags,
      isHabeasData: true,
    };
  }
  
  // Establecer fecha de retención (5 años por defecto según normativa colombiana)
  if (!this.retentionDate) {
    const retention = new Date();
    retention.setFullYear(retention.getFullYear() + 5);
    this.retentionDate = retention;
  }
  
  next();
});

// Método estático para crear log de auditoría
AuditLogSchema.statics.createLog = async function(logData: Partial<IAuditLog>): Promise<IAuditLog> {
  try {
    const log = new AuditLog(logData);
    return await log.save();
  } catch (error) {
    console.error('Error creating audit log:', error);
    // No lanzar error para no interrumpir la operación principal
    return null as any;
  }
};

// Método estático para logs de acciones críticas
AuditLogSchema.statics.logCriticalAction = async function(
  actorId: Types.ObjectId,
  action: AuditAction,
  entity: AuditEntity,
  entityId: string,
  details?: any
): Promise<IAuditLog> {
  const logData = {
    actorId,
    action,
    entity,
    entityId,
    isHighRisk: true,
    ...details,
  };
  return await this.createLog(logData);
};

// Método para sanitizar datos sensibles antes de guardar
AuditLogSchema.methods.sanitizeSensitiveData = function(): void {
  // Remover información sensible de los datos guardados
  const sensitiveFields = ['password', 'ssn', 'creditCard', 'token'];
  
  const sanitize = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = { ...obj };
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    // Recursivamente sanitizar objetos anidados
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'object') {
        sanitized[key] = sanitize(sanitized[key]);
      }
    }
    
    return sanitized;
  };
  
  if (this.previousData) {
    this.previousData = sanitize(this.previousData);
  }
  
  if (this.newData) {
    this.newData = sanitize(this.newData);
  }
};

// Método para serialización JSON
AuditLogSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Modelo
const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;