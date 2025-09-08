import { Schema, model, Document, Types } from 'mongoose';

// Enum de especialidades
export enum Specialty {
  MEDICINA_GENERAL = 'MedicinaGeneral',
  OPTOMETRIA = 'Optometria',
  AUDIOMETRIA = 'Audiometria',
  FONOAUDIOLOGIA = 'Fonoaudiologia',
  PSICOLOGIA = 'Psicologia',
  MEDICINA_OCUPACIONAL = 'MedicinaOcupacional',
  LABORATORIO = 'Laboratorio',
}

// Interface para secciones de la historia clínica
export interface IClinicalSection {
  specialty: Specialty;
  data: any; // Schema.Types.Mixed para flexibilidad
  specialistId: Types.ObjectId;
  status: 'Completado' | 'Pendiente' | 'EnProceso';
  startTime?: Date;
  endTime?: Date;
  formVersion?: string;
  attachments?: {
    url: string;
    type: string;
    description?: string;
    uploadedAt: Date;
  }[];
  notes?: string;
  signature?: string;
}

// Interface para TypeScript
export interface IClinicalRecord extends Document {
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  companyId: Types.ObjectId;
  recordNumber?: string;
  sections: IClinicalSection[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    oxygenSaturation?: number;
    recordedAt?: Date;
    recordedBy?: Types.ObjectId;
  };
  anamnesis?: {
    chiefComplaint?: string;
    presentIllness?: string;
    pastMedicalHistory?: string;
    familyHistory?: string;
    socialHistory?: string;
    reviewOfSystems?: any;
  };
  occupationalHistory?: {
    currentPosition?: string;
    yearsInPosition?: number;
    previousJobs?: {
      company: string;
      position: string;
      duration: string;
      risks: string[];
    }[];
    exposures?: {
      type: string;
      duration: string;
      protection: boolean;
    }[];
    accidents?: {
      date: Date;
      description: string;
      consequences: string;
    }[];
  };
  attachments?: {
    url: string;
    type: string;
    description?: string;
    uploadedAt: Date;
    uploadedBy: Types.ObjectId;
  }[];
  finalDiagnosis?: {
    diagnoses: {
      code: string;
      description: string;
      type: 'Principal' | 'Relacionado';
    }[];
    recommendations?: string[];
    restrictions?: string[];
    followUp?: string;
  };
  isLocked: boolean;
  lockedAt?: Date;
  lockedBy?: Types.ObjectId;
  createdBy: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const ClinicalRecordSchema = new Schema<IClinicalRecord>(
  {
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
    recordNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    sections: [
      {
        specialty: {
          type: String,
          enum: Object.values(Specialty),
          required: true,
        },
        data: {
          type: Schema.Types.Mixed,
          required: true,
        },
        specialistId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['Completado', 'Pendiente', 'EnProceso'],
          default: 'Pendiente',
        },
        startTime: Date,
        endTime: Date,
        formVersion: String,
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
            uploadedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        notes: {
          type: String,
          maxlength: 1000,
        },
        signature: String,
      },
    ],
    vitalSigns: {
      bloodPressure: String,
      heartRate: Number,
      respiratoryRate: Number,
      temperature: Number,
      weight: Number,
      height: Number,
      bmi: Number,
      oxygenSaturation: Number,
      recordedAt: Date,
      recordedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    anamnesis: {
      chiefComplaint: String,
      presentIllness: String,
      pastMedicalHistory: String,
      familyHistory: String,
      socialHistory: String,
      reviewOfSystems: Schema.Types.Mixed,
    },
    occupationalHistory: {
      currentPosition: String,
      yearsInPosition: Number,
      previousJobs: [
        {
          company: String,
          position: String,
          duration: String,
          risks: [String],
        },
      ],
      exposures: [
        {
          type: String,
          duration: String,
          protection: Boolean,
        },
      ],
      accidents: [
        {
          date: Date,
          description: String,
          consequences: String,
        },
      ],
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
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    finalDiagnosis: {
      diagnoses: [
        {
          code: String,
          description: String,
          type: {
            type: String,
            enum: ['Principal', 'Relacionado'],
          },
        },
      ],
      recommendations: [String],
      restrictions: [String],
      followUp: String,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockedAt: Date,
    lockedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
ClinicalRecordSchema.index({ patientId: 1, createdAt: -1 });
ClinicalRecordSchema.index({ companyId: 1, createdAt: -1 });
ClinicalRecordSchema.index({ 'sections.specialty': 1, 'sections.status': 1 });
ClinicalRecordSchema.index({ isLocked: 1 });

// Middleware para calcular BMI automáticamente
ClinicalRecordSchema.pre('save', function(next) {
  if (this.vitalSigns && this.vitalSigns.weight && this.vitalSigns.height) {
    const heightInMeters = this.vitalSigns.height / 100;
    this.vitalSigns.bmi = Number((this.vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  next();
});

// Método para verificar si todas las secciones están completas
ClinicalRecordSchema.methods.areAllSectionsCompleted = function(): boolean {
  return this.sections.every(section => section.status === 'Completado');
};

// Método para obtener el progreso de la historia clínica
ClinicalRecordSchema.methods.getProgress = function(): { completed: number; total: number; percentage: number } {
  const total = this.sections.length;
  const completed = this.sections.filter(section => section.status === 'Completado').length;
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

// Método para bloquear la historia clínica
ClinicalRecordSchema.methods.lock = async function(userId: Types.ObjectId): Promise<void> {
  this.isLocked = true;
  this.lockedAt = new Date();
  this.lockedBy = userId;
  await this.save();
};

// Método para serialización JSON
ClinicalRecordSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.progress = this.getProgress();
  delete obj.__v;
  return obj;
};

// Modelo
const ClinicalRecord = model<IClinicalRecord>('ClinicalRecord', ClinicalRecordSchema);

export default ClinicalRecord;