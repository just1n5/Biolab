import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// Enum de roles
export enum UserRole {
  ADMIN = 'Admin',
  GERENCIA = 'Gerencia',
  MEDICO = 'Medico',
  RECEPCION = 'Recepcion',
  LABORATORIO = 'Laboratorio',
  FACTURACION = 'Facturacion',
  EMPRESA_RRHH = 'Empresa-RRHH',
  PACIENTE = 'Paciente',
}

// Interface para TypeScript
export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  companyId?: Types.ObjectId;
  isActive: boolean;
  lastLogin?: Date;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  profilePhoto?: string;
  phone?: string;
  documentNumber?: string;
  specialty?: string;
  digitalSignatureUrl?: string;
  professionalCard?: string;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Schema de Mongoose
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: 'Formato de email inválido',
      },
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false, // No incluir en queries por defecto
    },
    fullName: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, 'El rol es requerido'],
      default: UserRole.PACIENTE,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      sparse: true,
      required: function(this: IUser) {
        return this.role === UserRole.EMPRESA_RRHH;
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    profilePhoto: {
      type: String,
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
    documentNumber: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    specialty: {
      type: String,
      enum: ['Medicina General', 'Optometria', 'Fonoaudiologia', 'Psicologia', 'Medicina Ocupacional'],
      required: function(this: IUser) {
        return this.role === UserRole.MEDICO;
      },
    },
    digitalSignatureUrl: {
      type: String,
    },
    professionalCard: {
      type: String,
      trim: true,
    },
    permissions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para optimización
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ companyId: 1 });
UserSchema.index({ createdAt: -1 });

// Middleware para hashear contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Log para debugging
    console.log('Hashing password for user:', this.email);
    
    // Generar salt y hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    
    console.log('Password hashed successfully');
    this.password = hashedPassword;
    
    next();
  } catch (error: any) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // Log para debugging
    console.log('Comparing passwords for user:', this.email);
    console.log('Candidate password length:', candidatePassword?.length);
    console.log('Stored password hash exists:', !!this.password);
    
    if (!this.password) {
      console.error('No password stored for user');
      return false;
    }
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Método para generar token JWT (implementación en utils/jwt.ts)
UserSchema.methods.generateAuthToken = function(): string {
  // Este método será implementado usando jsonwebtoken en utils
  return '';
};

// Método para serialización JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.__v;
  return obj;
};

// Modelo
const User = model<IUser>('User', UserSchema);

export default User;