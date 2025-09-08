import { Schema, model, Document, Types } from 'mongoose';

// Enum de conceptos de aptitud
export enum AptitudeConcept {
  APTO = 'Apto',
  NO_APTO = 'No Apto',
  APTO_CON_RESTRICCIONES = 'Apto con Restricciones',
  APLAZADO = 'Aplazado',
  PENDIENTE = 'Pendiente',
}

// Enum de tipos de certificado
export enum CertificateType {
  INGRESO = 'Ingreso',
  PERIODICO = 'Periodico',
  RETIRO = 'Retiro',
  POST_INCAPACIDAD = 'PostIncapacidad',
  CAMBIO_LABOR = 'CambioLabor',
  REINTEGRO = 'Reintegro',
}

// Interface para TypeScript
export interface ICertificate extends Document {
  certificateNumber: string;
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  companyId: Types.ObjectId;
  clinicalRecordId: Types.ObjectId;
  certificateType: CertificateType;
  concept: AptitudeConcept;
  issueDate: Date;
  expirationDate?: Date;
  validityDays?: number;
  medicalFindings?: {
    diagnosis: string;
    code?: string;
    severity?: 'Leve' | 'Moderado' | 'Severo';
  }[];
  recommendations?: string[];
  restrictions?: string[];
  followUpRequired?: boolean;
  followUpDate?: Date;
  workLimitations?: {
    type: string;
    description: string;
    duration?: string;
  }[];
  specialConsiderations?: string;
  doctorId: Types.ObjectId;
  doctorSignatureUrl: string;
  doctorProfessionalCard: string;
  doctorSpecialty: string;
  pdfUrl?: string;
  pdfGeneratedAt?: Date;
  qrCode?: string;
  verificationCode?: string;
  templateVersion?: string;
  legalDisclaimer?: string;
  deliveredTo?: {
    recipientName: string;
    recipientDocument: string;
    recipientRelation?: string;
    deliveryDate: Date;
    deliveryMethod: 'Digital' | 'Fisico' | 'Email';
    email?: string;
    notes?: string;
  };
  isValid: boolean;
  invalidatedAt?: Date;
  invalidatedBy?: Types.ObjectId;
  invalidationReason?: string;
  attachments?: {
    url: string;
    type: string;
    description?: string;
  }[];
  metadata?: {
    examsPerformed: string[];
    labResults?: any;
    vitalSigns?: any;
  };
  createdBy: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const CertificateSchema = new Schema<ICertificate>(
  {
    certificateNumber: {
      type: String,
      required: [true, 'El número de certificado es requerido'],
      unique: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'La cita es requerida'],
      unique: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'El paciente es requerido'],
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'La empresa es requerida'],
      index: true,
    },
    clinicalRecordId: {
      type: Schema.Types.ObjectId,
      ref: 'ClinicalRecord',
      required: [true, 'La historia clínica es requerida'],
    },
    certificateType: {
      type: String,
      enum: Object.values(CertificateType),
      required: [true, 'El tipo de certificado es requerido'],
    },
    concept: {
      type: String,
      enum: Object.values(AptitudeConcept),
      required: [true, 'El concepto de aptitud es requerido'],
      index: true,
    },
    issueDate: {
      type: Date,
      required: [true, 'La fecha de emisión es requerida'],
      default: Date.now,
      index: true,
    },
    expirationDate: {
      type: Date,
      index: true,
    },
    validityDays: {
      type: Number,
      min: 1,
      max: 730, // Máximo 2 años
    },
    medicalFindings: [
      {
        diagnosis: {
          type: String,
          required: true,
        },
        code: String,
        severity: {
          type: String,
          enum: ['Leve', 'Moderado', 'Severo'],
        },
      },
    ],
    recommendations: [
      {
        type: String,
        maxlength: 500,
      },
    ],
    restrictions: [
      {
        type: String,
        maxlength: 500,
      },
    ],
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: Date,
    workLimitations: [
      {
        type: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        duration: String,
      },
    ],
    specialConsiderations: {
      type: String,
      maxlength: 1000,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El médico es requerido'],
    },
    doctorSignatureUrl: {
      type: String,
      required: [true, 'La firma del médico es requerida'],
    },
    doctorProfessionalCard: {
      type: String,
      required: [true, 'La tarjeta profesional es requerida'],
    },
    doctorSpecialty: {
      type: String,
      required: [true, 'La especialidad del médico es requerida'],
    },
    pdfUrl: {
      type: String,
    },
    pdfGeneratedAt: Date,
    qrCode: {
      type: String,
    },
    verificationCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    templateVersion: {
      type: String,
      default: '1.0',
    },
    legalDisclaimer: {
      type: String,
      default: 'Este certificado es válido únicamente para efectos laborales y tiene una vigencia según lo establecido en la normatividad vigente.',
    },
    deliveredTo: {
      recipientName: String,
      recipientDocument: String,
      recipientRelation: String,
      deliveryDate: Date,
      deliveryMethod: {
        type: String,
        enum: ['Digital', 'Fisico', 'Email'],
      },
      email: String,
      notes: String,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    invalidatedAt: Date,
    invalidatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    invalidationReason: {
      type: String,
      maxlength: 500,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        description: String,
      },
    ],
    metadata: {
      examsPerformed: [String],
      labResults: Schema.Types.Mixed,
      vitalSigns: Schema.Types.Mixed,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para optimización
CertificateSchema.index({ companyId: 1, issueDate: -1 });
CertificateSchema.index({ patientId: 1, issueDate: -1 });
CertificateSchema.index({ isValid: 1, concept: 1 });
CertificateSchema.index({ verificationCode: 1 });

// Middleware para generar número de certificado
CertificateSchema.pre('save', async function(next) {
  if (!this.certificateNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Buscar el último certificado del mes
    const lastCert = await Certificate.findOne({
      certificateNumber: new RegExp(`^CERT-${year}${month}-`),
    })
      .sort({ certificateNumber: -1 })
      .limit(1);
    
    let sequential = 1;
    if (lastCert && lastCert.certificateNumber) {
      const parts = lastCert.certificateNumber.split('-');
      sequential = parseInt(parts[2]) + 1;
    }
    
    this.certificateNumber = `CERT-${year}${month}-${String(sequential).padStart(5, '0')}`;
  }
  
  // Generar código de verificación
  if (!this.verificationCode) {
    this.verificationCode = Math.random().toString(36).substring(2, 15).toUpperCase();
  }
  
  // Calcular fecha de expiración si hay días de validez
  if (this.validityDays && !this.expirationDate) {
    const expDate = new Date(this.issueDate);
    expDate.setDate(expDate.getDate() + this.validityDays);
    this.expirationDate = expDate;
  }
  
  next();
});

// Método para invalidar certificado
CertificateSchema.methods.invalidate = async function(
  userId: Types.ObjectId,
  reason: string
): Promise<void> {
  this.isValid = false;
  this.invalidatedAt = new Date();
  this.invalidatedBy = userId;
  this.invalidationReason = reason;
  await this.save();
};

// Método para verificar si está vigente
CertificateSchema.methods.isExpired = function(): boolean {
  if (!this.expirationDate) return false;
  return new Date() > this.expirationDate;
};

// Método para marcar como entregado
CertificateSchema.methods.markAsDelivered = async function(
  deliveryInfo: any
): Promise<void> {
  this.deliveredTo = {
    ...deliveryInfo,
    deliveryDate: new Date(),
  };
  await this.save();
};

// Método para serialización JSON
CertificateSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.isExpired = this.isExpired();
  delete obj.__v;
  return obj;
};

// Modelo
const Certificate = model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;