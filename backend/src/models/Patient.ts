import { Schema, model, Document, Types } from 'mongoose';

// Interface para TypeScript
export interface IPatient extends Document {
  documentNumber: string;
  documentType: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  age?: number;
  gender: 'M' | 'F' | 'Otro';
  photoUrl?: string;
  digitalSignatureUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  maritalStatus?: string;
  educationLevel?: string;
  occupation?: string;
  companyId?: Types.ObjectId;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory?: {
    allergies?: string[];
    chronicDiseases?: string[];
    currentMedications?: string[];
    bloodType?: string;
    notes?: string;
  };
  consentForms?: {
    type: string;
    signedDate: Date;
    signatureUrl: string;
    ipAddress?: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const PatientSchema = new Schema<IPatient>(
  {
    documentNumber: {
      type: String,
      required: [true, 'El número de documento es requerido'],
      unique: true,
      index: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          // Validación básica para documentos colombianos
          return /^\d{6,12}$/.test(v);
        },
        message: 'Formato de documento inválido',
      },
    },
    documentType: {
      type: String,
      required: [true, 'El tipo de documento es requerido'],
      enum: ['CC', 'CE', 'PA', 'TI', 'RC', 'PEP', 'PPT'],
      default: 'CC',
    },
    firstName: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    lastName: {
      type: String,
      required: [true, 'El apellido es requerido'],
      trim: true,
      maxlength: [100, 'El apellido no puede exceder 100 caracteres'],
    },
    birthDate: {
      type: Date,
      required: [true, 'La fecha de nacimiento es requerida'],
      validate: {
        validator: function(v: Date) {
          return v < new Date();
        },
        message: 'La fecha de nacimiento debe ser en el pasado',
      },
    },
    gender: {
      type: String,
      required: [true, 'El género es requerido'],
      enum: ['M', 'F', 'Otro'],
    },
    photoUrl: {
      type: String,
    },
    digitalSignatureUrl: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      validate: {
        validator: function(v: string) {
          return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: 'Formato de email inválido',
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^\+?[\d\s()-]+$/.test(v);
        },
        message: 'Formato de teléfono inválido',
      },
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'La dirección no puede exceder 200 caracteres'],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'La ciudad no puede exceder 100 caracteres'],
    },
    department: {
      type: String,
      trim: true,
      maxlength: [100, 'El departamento no puede exceder 100 caracteres'],
    },
    maritalStatus: {
      type: String,
      enum: ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Union Libre', 'Separado'],
    },
    educationLevel: {
      type: String,
      enum: ['Ninguno', 'Primaria', 'Secundaria', 'Técnico', 'Tecnólogo', 'Profesional', 'Especialización', 'Maestría', 'Doctorado'],
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: [100, 'La ocupación no puede exceder 100 caracteres'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    medicalHistory: {
      allergies: [String],
      chronicDiseases: [String],
      currentMedications: [String],
      bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      },
      notes: {
        type: String,
        maxlength: 1000,
      },
    },
    consentForms: [
      {
        type: {
          type: String,
          required: true,
        },
        signedDate: {
          type: Date,
          required: true,
        },
        signatureUrl: {
          type: String,
          required: true,
        },
        ipAddress: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Virtual para calcular edad
PatientSchema.virtual('age').get(function() {
  if (!this.birthDate) return undefined;
  
  const today = new Date();
  const birth = new Date(this.birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
});

// Índices para optimización
PatientSchema.index({ firstName: 'text', lastName: 'text' });
PatientSchema.index({ companyId: 1 });
PatientSchema.index({ isActive: 1 });
PatientSchema.index({ createdAt: -1 });

// Método para nombre completo
PatientSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`;
};

// Método para serialización JSON
PatientSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.age = this.age;
  delete obj.__v;
  return obj;
};

// Modelo
const Patient = model<IPatient>('Patient', PatientSchema);

export default Patient;