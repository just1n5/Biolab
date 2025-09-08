import { Schema, model, Document, Types } from 'mongoose';

// Interface para TypeScript
export interface ICompany extends Document {
  name: string;
  nit: string;
  address: string;
  phone?: string;
  email?: string;
  contacts: {
    name: string;
    position: string;
    email: string;
    phone: string;
  }[];
  contractId?: Types.ObjectId;
  priceListId?: Types.ObjectId;
  profesiograms?: Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Campos adicionales para gestión
  taxId?: string;
  economicActivity?: string;
  legalRepresentative?: string;
  billingAddress?: string;
  notes?: string;
}

// Schema de Mongoose
const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la empresa es requerido'],
      trim: true,
      maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
    },
    nit: {
      type: String,
      required: [true, 'El NIT es requerido'],
      unique: true,
      index: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          // Validación básica de NIT colombiano
          return /^\d{9}-\d$/.test(v) || /^\d{8,10}$/.test(v);
        },
        message: 'Formato de NIT inválido',
      },
    },
    address: {
      type: String,
      required: [true, 'La dirección es requerida'],
      trim: true,
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
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string) {
          return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: 'Formato de email inválido',
      },
    },
    contacts: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        position: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
          validate: {
            validator: function(v: string) {
              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: 'Formato de email inválido',
          },
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    contractId: {
      type: Schema.Types.ObjectId,
      ref: 'Contract',
    },
    priceListId: {
      type: Schema.Types.ObjectId,
      ref: 'PriceList',
    },
    profesiograms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Profesiogram',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    // Campos adicionales
    taxId: {
      type: String,
      trim: true,
    },
    economicActivity: {
      type: String,
      trim: true,
    },
    legalRepresentative: {
      type: String,
      trim: true,
    },
    billingAddress: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para optimización
CompanySchema.index({ name: 'text' });
CompanySchema.index({ isActive: 1 });
CompanySchema.index({ createdAt: -1 });

// Métodos del modelo
CompanySchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Modelo
const Company = model<ICompany>('Company', CompanySchema);

export default Company;