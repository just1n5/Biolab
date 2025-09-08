import { Schema, model, Document, Types } from 'mongoose';

// Enum de estados de cita
export enum AppointmentStatus {
  SCHEDULED = 'Agendada',
  IN_ADMISSION = 'En-Admision',
  IN_EXAM = 'En-Examen',
  PENDING_RESULTS = 'Resultados-Pendientes',
  CERTIFICATE_AVAILABLE = 'Certificado-Disponible',
  CANCELLED = 'Cancelada',
  NO_SHOW = 'No-Asistio',
  COMPLETED = 'Completada',
}

// Interface para TypeScript
export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  companyId: Types.ObjectId;
  profesiogramId: Types.ObjectId;
  specialistIds?: Types.ObjectId[];
  scheduledDate: Date;
  scheduledTime: string;
  actualArrivalTime?: Date;
  completionTime?: Date;
  status: AppointmentStatus;
  examType: 'Ingreso' | 'Periodico' | 'Retiro' | 'PostIncapacidad' | 'CambioLabor';
  isMassive: boolean;
  batchId?: string;
  examsToPerform: {
    examName: string;
    type: 'lab' | 'specialty' | 'medical';
    status: 'Pendiente' | 'EnProceso' | 'Completado' | 'Omitido';
    specialistId?: Types.ObjectId;
    startTime?: Date;
    endTime?: Date;
    notes?: string;
  }[];
  routeSheet?: {
    generatedAt: Date;
    stations: {
      order: number;
      location: string;
      examName: string;
      estimatedTime: number;
    }[];
  };
  paymentStatus?: 'Pendiente' | 'Facturado' | 'Pagado';
  invoiceId?: Types.ObjectId;
  notes?: string;
  cancellationReason?: string;
  createdBy: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const AppointmentSchema = new Schema<IAppointment>(
  {
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
    profesiogramId: {
      type: Schema.Types.ObjectId,
      ref: 'Profesiogram',
      required: [true, 'El profesiograma es requerido'],
    },
    specialistIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    scheduledDate: {
      type: Date,
      required: [true, 'La fecha de la cita es requerida'],
      index: true,
    },
    scheduledTime: {
      type: String,
      required: [true, 'La hora de la cita es requerida'],
      validate: {
        validator: function(v: string) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: 'Formato de hora inválido (HH:MM)',
      },
    },
    actualArrivalTime: {
      type: Date,
    },
    completionTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED,
      required: true,
      index: true,
    },
    examType: {
      type: String,
      enum: ['Ingreso', 'Periodico', 'Retiro', 'PostIncapacidad', 'CambioLabor'],
      required: [true, 'El tipo de examen es requerido'],
    },
    isMassive: {
      type: Boolean,
      default: false,
    },
    batchId: {
      type: String,
      sparse: true,
      index: true,
    },
    examsToPerform: [
      {
        examName: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
          enum: ['lab', 'specialty', 'medical'],
        },
        status: {
          type: String,
          enum: ['Pendiente', 'EnProceso', 'Completado', 'Omitido'],
          default: 'Pendiente',
        },
        specialistId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        startTime: Date,
        endTime: Date,
        notes: {
          type: String,
          maxlength: 500,
        },
      },
    ],
    routeSheet: {
      generatedAt: Date,
      stations: [
        {
          order: {
            type: Number,
            required: true,
          },
          location: {
            type: String,
            required: true,
          },
          examName: {
            type: String,
            required: true,
          },
          estimatedTime: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
    },
    paymentStatus: {
      type: String,
      enum: ['Pendiente', 'Facturado', 'Pagado'],
      default: 'Pendiente',
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    cancellationReason: {
      type: String,
      maxlength: 500,
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

// Índices compuestos para optimización
AppointmentSchema.index({ companyId: 1, status: 1 });
AppointmentSchema.index({ scheduledDate: 1, status: 1 });
AppointmentSchema.index({ patientId: 1, scheduledDate: -1 });
AppointmentSchema.index({ createdAt: -1 });

// Middleware para actualizar el estado basado en los exámenes
AppointmentSchema.pre('save', function(next) {
  if (this.isModified('examsToPerform')) {
    const allCompleted = this.examsToPerform.every(
      exam => exam.status === 'Completado' || exam.status === 'Omitido'
    );
    
    if (allCompleted && this.status !== AppointmentStatus.CERTIFICATE_AVAILABLE) {
      this.status = AppointmentStatus.PENDING_RESULTS;
    }
  }
  next();
});

// Método para verificar si todos los exámenes están completos
AppointmentSchema.methods.areAllExamsCompleted = function(): boolean {
  return this.examsToPerform.every(
    exam => exam.status === 'Completado' || exam.status === 'Omitido'
  );
};

// Método para obtener el progreso de la cita
AppointmentSchema.methods.getProgress = function(): { completed: number; total: number; percentage: number } {
  const total = this.examsToPerform.length;
  const completed = this.examsToPerform.filter(
    exam => exam.status === 'Completado' || exam.status === 'Omitido'
  ).length;
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

// Método para serialización JSON
AppointmentSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.progress = this.getProgress();
  delete obj.__v;
  return obj;
};

// Modelo
const Appointment = model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;