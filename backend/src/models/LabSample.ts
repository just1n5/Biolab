import { Schema, model, Document, Types } from 'mongoose';

// Enum de estados de muestra
export enum SampleStatus {
  REGISTERED = 'Registrada',
  COLLECTED = 'Recolectada',
  IN_TRANSIT = 'En-Transito',
  RECEIVED = 'Recibida',
  IN_PROCESS = 'En-Proceso',
  COMPLETED = 'Completada',
  VALIDATED = 'Validada',
  REPORTED = 'Reportada',
  REJECTED = 'Rechazada',
}

// Enum de tipos de muestra
export enum SampleType {
  BLOOD = 'Sangre',
  URINE = 'Orina',
  STOOL = 'Heces',
  SALIVA = 'Saliva',
  SPUTUM = 'Esputo',
  SWAB = 'Hisopado',
  OTHER = 'Otro',
}

// Interface para TypeScript
export interface ILabSample extends Document {
  barcodeId: string;
  appointmentId: Types.ObjectId;
  patientId: Types.ObjectId;
  sampleType: SampleType;
  testType: string[];
  collectionDate: Date;
  collectionTime: string;
  collectedBy: Types.ObjectId;
  collectionSite?: string;
  sampleVolume?: string;
  container?: string;
  preservative?: string;
  storageConditions?: string;
  statusHistory: {
    status: SampleStatus;
    timestamp: Date;
    userId: Types.ObjectId;
    notes?: string;
    location?: string;
  }[];
  currentStatus: SampleStatus;
  results?: {
    testName: string;
    result: string | number;
    unit?: string;
    referenceRange?: string;
    flag?: 'Normal' | 'Alto' | 'Bajo' | 'Critico';
    enteredBy: Types.ObjectId;
    enteredAt: Date;
    validatedBy?: Types.ObjectId;
    validatedAt?: Date;
    notes?: string;
    methodology?: string;
  }[];
  rejectionReason?: string;
  priority?: 'Normal' | 'Urgente' | 'Critico';
  expirationDate?: Date;
  chainOfCustody: {
    action: string;
    timestamp: Date;
    userId: Types.ObjectId;
    location?: string;
    temperature?: number;
    notes?: string;
  }[];
  qualityControl?: {
    passed: boolean;
    checkedBy: Types.ObjectId;
    checkedAt: Date;
    notes?: string;
  };
  attachments?: {
    url: string;
    type: string;
    description?: string;
    uploadedAt: Date;
  }[];
  isActive: boolean;
  createdBy: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const LabSampleSchema = new Schema<ILabSample>(
  {
    barcodeId: {
      type: String,
      required: [true, 'El código de barras es requerido'],
      unique: true,
      index: true,
      trim: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'La cita es requerida'],
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'El paciente es requerido'],
      index: true,
    },
    sampleType: {
      type: String,
      enum: Object.values(SampleType),
      required: [true, 'El tipo de muestra es requerido'],
    },
    testType: [
      {
        type: String,
        required: true,
      },
    ],
    collectionDate: {
      type: Date,
      required: [true, 'La fecha de recolección es requerida'],
      index: true,
    },
    collectionTime: {
      type: String,
      required: [true, 'La hora de recolección es requerida'],
      validate: {
        validator: function(v: string) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: 'Formato de hora inválido (HH:MM)',
      },
    },
    collectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El recolector es requerido'],
    },
    collectionSite: {
      type: String,
      trim: true,
    },
    sampleVolume: {
      type: String,
      trim: true,
    },
    container: {
      type: String,
      trim: true,
    },
    preservative: {
      type: String,
      trim: true,
    },
    storageConditions: {
      type: String,
      trim: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: Object.values(SampleStatus),
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
          default: Date.now,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        notes: {
          type: String,
          maxlength: 500,
        },
        location: {
          type: String,
          trim: true,
        },
      },
    ],
    currentStatus: {
      type: String,
      enum: Object.values(SampleStatus),
      default: SampleStatus.REGISTERED,
      required: true,
      index: true,
    },
    results: [
      {
        testName: {
          type: String,
          required: true,
        },
        result: {
          type: Schema.Types.Mixed,
          required: true,
        },
        unit: String,
        referenceRange: String,
        flag: {
          type: String,
          enum: ['Normal', 'Alto', 'Bajo', 'Critico'],
        },
        enteredBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        enteredAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
        validatedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        validatedAt: Date,
        notes: {
          type: String,
          maxlength: 500,
        },
        methodology: String,
      },
    ],
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
    priority: {
      type: String,
      enum: ['Normal', 'Urgente', 'Critico'],
      default: 'Normal',
    },
    expirationDate: Date,
    chainOfCustody: [
      {
        action: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
          default: Date.now,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        location: String,
        temperature: Number,
        notes: {
          type: String,
          maxlength: 500,
        },
      },
    ],
    qualityControl: {
      passed: {
        type: Boolean,
        required: true,
      },
      checkedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      checkedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      notes: {
        type: String,
        maxlength: 500,
      },
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
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
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
LabSampleSchema.index({ collectionDate: -1, currentStatus: 1 });
LabSampleSchema.index({ patientId: 1, collectionDate: -1 });
LabSampleSchema.index({ priority: 1, currentStatus: 1 });

// Middleware para actualizar el estado actual
LabSampleSchema.pre('save', function(next) {
  if (this.statusHistory && this.statusHistory.length > 0) {
    const lastStatus = this.statusHistory[this.statusHistory.length - 1];
    this.currentStatus = lastStatus.status;
  }
  next();
});

// Método para agregar un nuevo estado
LabSampleSchema.methods.addStatus = async function(
  status: SampleStatus,
  userId: Types.ObjectId,
  notes?: string,
  location?: string
): Promise<void> {
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    userId,
    notes,
    location,
  });
  this.currentStatus = status;
  await this.save();
};

// Método para agregar a la cadena de custodia
LabSampleSchema.methods.addChainOfCustody = async function(
  action: string,
  userId: Types.ObjectId,
  location?: string,
  temperature?: number,
  notes?: string
): Promise<void> {
  this.chainOfCustody.push({
    action,
    timestamp: new Date(),
    userId,
    location,
    temperature,
    notes,
  });
  await this.save();
};

// Método para verificar si todos los resultados están validados
LabSampleSchema.methods.areAllResultsValidated = function(): boolean {
  if (!this.results || this.results.length === 0) return false;
  return this.results.every(result => result.validatedBy && result.validatedAt);
};

// Método para serialización JSON
LabSampleSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Modelo
const LabSample = model<ILabSample>('LabSample', LabSampleSchema);

export default LabSample;