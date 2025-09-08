import { Schema, model, Document, Types } from 'mongoose';

// Interface para los exámenes
export interface IExam {
  examName: string;
  type: 'lab' | 'specialty' | 'medical';
  category?: string;
  isRequired: boolean;
  description?: string;
  code?: string;
  defaultPrice?: number;
}

// Interface para TypeScript
export interface IProfesiogram extends Document {
  name: string;
  description?: string;
  code?: string;
  exams: IExam[];
  companies?: Types.ObjectId[];
  examType?: 'Ingreso' | 'Periodico' | 'Retiro' | 'PostIncapacidad' | 'CambioLabor';
  riskLevel?: 'I' | 'II' | 'III' | 'IV' | 'V';
  jobPositions?: string[];
  validityMonths?: number;
  isActive: boolean;
  isDefault: boolean;
  createdBy: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const ProfesiogramSchema = new Schema<IProfesiogram>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del profesiograma es requerido'],
      trim: true,
      unique: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    exams: [
      {
        examName: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          required: true,
          enum: ['lab', 'specialty', 'medical'],
        },
        category: {
          type: String,
          trim: true,
        },
        isRequired: {
          type: Boolean,
          default: true,
        },
        description: {
          type: String,
          trim: true,
        },
        code: {
          type: String,
          trim: true,
        },
        defaultPrice: {
          type: Number,
          min: 0,
        },
      },
    ],
    companies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Company',
      },
    ],
    examType: {
      type: String,
      enum: ['Ingreso', 'Periodico', 'Retiro', 'PostIncapacidad', 'CambioLabor'],
    },
    riskLevel: {
      type: String,
      enum: ['I', 'II', 'III', 'IV', 'V'],
    },
    jobPositions: [
      {
        type: String,
        trim: true,
      },
    ],
    validityMonths: {
      type: Number,
      min: 1,
      max: 60,
      default: 12,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
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
ProfesiogramSchema.index({ name: 'text', description: 'text' });
ProfesiogramSchema.index({ code: 1 });
ProfesiogramSchema.index({ companies: 1 });
ProfesiogramSchema.index({ isActive: 1, isDefault: 1 });
ProfesiogramSchema.index({ createdAt: -1 });

// Método para obtener el precio total por defecto
ProfesiogramSchema.methods.getTotalDefaultPrice = function(): number {
  return this.exams.reduce((total: number, exam: IExam) => {
    return total + (exam.defaultPrice || 0);
  }, 0);
};

// Método para obtener exámenes por tipo
ProfesiogramSchema.methods.getExamsByType = function(type: string): IExam[] {
  return this.exams.filter((exam: IExam) => exam.type === type);
};

// Método para serialización JSON
ProfesiogramSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Modelo
const Profesiogram = model<IProfesiogram>('Profesiogram', ProfesiogramSchema);

// Profesiogramas predeterminados
export const defaultProfesiograms = [
  {
    name: 'Perfil Administrativo',
    code: 'ADMIN',
    description: 'Perfil básico para personal administrativo',
    exams: [
      { examName: 'Examen Médico Ocupacional', type: 'medical', isRequired: true },
      { examName: 'Visiometría', type: 'specialty', isRequired: true },
    ],
  },
  {
    name: 'Perfil Conductor',
    code: 'DRIVER',
    description: 'Perfil completo para conductores',
    exams: [
      { examName: 'Examen Médico Ocupacional', type: 'medical', isRequired: true },
      { examName: 'Visiometría', type: 'specialty', isRequired: true },
      { examName: 'Audiometría', type: 'specialty', isRequired: true },
      { examName: 'Psicosensometría', type: 'specialty', isRequired: true },
    ],
  },
  {
    name: 'Perfil Trabajo en Alturas',
    code: 'HEIGHTS',
    description: 'Perfil avanzado para trabajo en alturas',
    exams: [
      { examName: 'Examen Médico Ocupacional', type: 'medical', isRequired: true },
      { examName: 'Visiometría', type: 'specialty', isRequired: true },
      { examName: 'Audiometría', type: 'specialty', isRequired: true },
      { examName: 'Psicosensometría', type: 'specialty', isRequired: true },
      { examName: 'Glicemia', type: 'lab', isRequired: true },
      { examName: 'Perfil Lipídico', type: 'lab', isRequired: true },
      { examName: 'Electrocardiograma', type: 'specialty', isRequired: true },
    ],
  },
];

export default Profesiogram;