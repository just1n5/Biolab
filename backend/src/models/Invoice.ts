import { Schema, model, Document, Types } from 'mongoose';

// Enum de estados de factura
export enum InvoiceStatus {
  DRAFT = 'Borrador',
  PENDING = 'Pendiente',
  SENT = 'Enviada',
  PAID = 'Pagada',
  PARTIALLY_PAID = 'Pago-Parcial',
  OVERDUE = 'Vencida',
  CANCELLED = 'Cancelada',
}

// Enum de métodos de pago
export enum PaymentMethod {
  CASH = 'Efectivo',
  TRANSFER = 'Transferencia',
  CHECK = 'Cheque',
  CREDIT_CARD = 'Tarjeta-Credito',
  DEBIT_CARD = 'Tarjeta-Debito',
  PSE = 'PSE',
  OTHER = 'Otro',
}

// Interface para items de factura
export interface IInvoiceItem {
  description: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  tax?: number;
  taxRate?: number;
  subtotal: number;
  total: number;
  appointmentId?: Types.ObjectId;
  profesiogramId?: Types.ObjectId;
  notes?: string;
}

// Interface para pagos
export interface IPayment {
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  reference?: string;
  bank?: string;
  notes?: string;
  receivedBy: Types.ObjectId;
  receiptNumber?: string;
}

// Interface para TypeScript
export interface IInvoice extends Document {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  companyId: Types.ObjectId;
  contractId?: Types.ObjectId;
  billingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  items: IInvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalTax: number;
  totalAmount: number;
  status: InvoiceStatus;
  payments: IPayment[];
  paidAmount: number;
  balanceDue: number;
  currency: string;
  exchangeRate?: number;
  paymentTerms?: string;
  notes?: string;
  internalNotes?: string;
  attachments?: {
    url: string;
    type: string;
    description?: string;
    uploadedAt: Date;
  }[];
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId?: string;
  legalName?: string;
  electronicInvoice?: {
    cufe?: string;
    qrCode?: string;
    dianResponse?: any;
    sentAt?: Date;
  };
  reminders?: {
    sentAt: Date;
    sentBy: Types.ObjectId;
    method: string;
    notes?: string;
  }[];
  creditNoteId?: Types.ObjectId;
  isVoid: boolean;
  voidReason?: string;
  voidDate?: Date;
  voidBy?: Types.ObjectId;
  createdBy: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: [true, 'El número de factura es requerido'],
      unique: true,
      index: true,
    },
    invoiceDate: {
      type: Date,
      required: [true, 'La fecha de factura es requerida'],
      default: Date.now,
      index: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'La fecha de vencimiento es requerida'],
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'La empresa es requerida'],
      index: true,
    },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: 'Contract',
    },
    billingPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        code: String,
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        discount: {
          type: Number,
          default: 0,
          min: 0,
        },
        discountType: {
          type: String,
          enum: ['percentage', 'fixed'],
          default: 'percentage',
        },
        tax: {
          type: Number,
          default: 0,
          min: 0,
        },
        taxRate: {
          type: Number,
          default: 19, // IVA Colombia
          min: 0,
          max: 100,
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
        appointmentId: {
          type: Schema.Types.ObjectId,
          ref: 'Appointment',
        },
        profesiogramId: {
          type: Schema.Types.ObjectId,
          ref: 'Profesiogram',
        },
        notes: String,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxableAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTax: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.DRAFT,
      required: true,
      index: true,
    },
    payments: [
      {
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        paymentDate: {
          type: Date,
          required: true,
        },
        paymentMethod: {
          type: String,
          enum: Object.values(PaymentMethod),
          required: true,
        },
        reference: String,
        bank: String,
        notes: String,
        receivedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        receiptNumber: String,
      },
    ],
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    balanceDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'COP',
      required: true,
    },
    exchangeRate: {
      type: Number,
      default: 1,
    },
    paymentTerms: {
      type: String,
      default: 'Net 30',
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    internalNotes: {
      type: String,
      maxlength: 1000,
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
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Colombia',
      },
    },
    taxId: String,
    legalName: String,
    electronicInvoice: {
      cufe: String,
      qrCode: String,
      dianResponse: Schema.Types.Mixed,
      sentAt: Date,
    },
    reminders: [
      {
        sentAt: {
          type: Date,
          required: true,
        },
        sentBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        method: {
          type: String,
          required: true,
        },
        notes: String,
      },
    ],
    creditNoteId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    isVoid: {
      type: Boolean,
      default: false,
    },
    voidReason: {
      type: String,
      maxlength: 500,
    },
    voidDate: Date,
    voidBy: {
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
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices compuestos para optimización
InvoiceSchema.index({ companyId: 1, invoiceDate: -1 });
InvoiceSchema.index({ status: 1, dueDate: 1 });
InvoiceSchema.index({ 'billingPeriod.startDate': 1, 'billingPeriod.endDate': 1 });

// Middleware para generar número de factura
InvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Buscar la última factura del mes
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: new RegExp(`^FV-${year}${month}-`),
    })
      .sort({ invoiceNumber: -1 })
      .limit(1);
    
    let sequential = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split('-');
      sequential = parseInt(parts[2]) + 1;
    }
    
    this.invoiceNumber = `FV-${year}${month}-${String(sequential).padStart(5, '0')}`;
  }
  
  // Calcular totales
  this.calculateTotals();
  
  // Actualizar estado basado en pagos
  this.updatePaymentStatus();
  
  next();
});

// Método para calcular totales
InvoiceSchema.methods.calculateTotals = function(): void {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  
  this.items.forEach((item: IInvoiceItem) => {
    // Calcular subtotal del item
    item.subtotal = item.quantity * item.unitPrice;
    
    // Aplicar descuento
    if (item.discount) {
      const discount = item.discountType === 'percentage' 
        ? item.subtotal * (item.discount / 100)
        : item.discount;
      totalDiscount += discount;
      item.subtotal -= discount;
    }
    
    // Calcular impuesto
    if (item.taxRate) {
      item.tax = item.subtotal * (item.taxRate / 100);
      totalTax += item.tax;
    }
    
    // Total del item
    item.total = item.subtotal + (item.tax || 0);
    subtotal += item.subtotal;
  });
  
  this.subtotal = subtotal;
  this.totalDiscount = totalDiscount;
  this.taxableAmount = subtotal;
  this.totalTax = totalTax;
  this.totalAmount = subtotal + totalTax;
  
  // Calcular saldo pendiente
  this.paidAmount = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  this.balanceDue = this.totalAmount - this.paidAmount;
};

// Método para actualizar estado de pago
InvoiceSchema.methods.updatePaymentStatus = function(): void {
  if (this.isVoid) {
    this.status = InvoiceStatus.CANCELLED;
  } else if (this.paidAmount >= this.totalAmount) {
    this.status = InvoiceStatus.PAID;
  } else if (this.paidAmount > 0) {
    this.status = InvoiceStatus.PARTIALLY_PAID;
  } else if (new Date() > this.dueDate && this.status !== InvoiceStatus.DRAFT) {
    this.status = InvoiceStatus.OVERDUE;
  }
};

// Método para agregar pago
InvoiceSchema.methods.addPayment = async function(payment: IPayment): Promise<void> {
  this.payments.push(payment);
  this.calculateTotals();
  this.updatePaymentStatus();
  await this.save();
};

// Método para anular factura
InvoiceSchema.methods.voidInvoice = async function(userId: Types.ObjectId, reason: string): Promise<void> {
  this.isVoid = true;
  this.voidReason = reason;
  this.voidDate = new Date();
  this.voidBy = userId;
  this.status = InvoiceStatus.CANCELLED;
  await this.save();
};

// Método para serialización JSON
InvoiceSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.isOverdue = this.status === InvoiceStatus.OVERDUE;
  obj.daysOverdue = this.dueDate < new Date() ? Math.floor((Date.now() - this.dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  delete obj.__v;
  return obj;
};

// Modelo
const Invoice = model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;