// Enums
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

export enum AptitudeConcept {
  APTO = 'Apto',
  NO_APTO = 'No Apto',
  APTO_CON_RESTRICCIONES = 'Apto con Restricciones',
  APLAZADO = 'Aplazado',
  PENDIENTE = 'Pendiente',
}

// User types
export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId?: Company;
  isActive: boolean;
  lastLogin?: Date;
  profilePhoto?: string;
  phone?: string;
  documentNumber?: string;
  specialty?: string;
  digitalSignatureUrl?: string;
  professionalCard?: string;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// Company types
export interface Company {
  _id: string;
  name: string;
  nit: string;
  address: string;
  phone?: string;
  email?: string;
  contacts: Contact[];
  contractId?: string;
  priceListId?: string;
  profesiograms?: string[];
  isActive: boolean;
  taxId?: string;
  economicActivity?: string;
  legalRepresentative?: string;
  billingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  name: string;
  position: string;
  email: string;
  phone: string;
}

// Patient types
export interface Patient {
  _id: string;
  documentNumber: string;
  documentType: 'CC' | 'CE' | 'PA' | 'TI' | 'RC' | 'PEP' | 'PPT';
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
  companyId?: string;
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Profesiogram types
export interface Exam {
  examName: string;
  type: 'lab' | 'specialty' | 'medical';
  category?: string;
  isRequired: boolean;
  description?: string;
  code?: string;
  defaultPrice?: number;
}

export interface Profesiogram {
  _id: string;
  name: string;
  description?: string;
  code?: string;
  exams: Exam[];
  companies?: string[];
  examType?: 'Ingreso' | 'Periodico' | 'Retiro' | 'PostIncapacidad' | 'CambioLabor';
  riskLevel?: 'I' | 'II' | 'III' | 'IV' | 'V';
  jobPositions?: string[];
  validityMonths?: number;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment types
export interface Appointment {
  _id: string;
  patientId: string | Patient;
  companyId: string | Company;
  profesiogramId: string | Profesiogram;
  specialistIds?: string[];
  scheduledDate: Date;
  scheduledTime: string;
  actualArrivalTime?: Date;
  completionTime?: Date;
  status: AppointmentStatus;
  examType: 'Ingreso' | 'Periodico' | 'Retiro' | 'PostIncapacidad' | 'CambioLabor';
  isMassive: boolean;
  batchId?: string;
  examsToPerform: ExamToPerform[];
  routeSheet?: RouteSheet;
  paymentStatus?: 'Pendiente' | 'Facturado' | 'Pagado';
  invoiceId?: string;
  notes?: string;
  cancellationReason?: string;
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamToPerform {
  examName: string;
  type: 'lab' | 'specialty' | 'medical';
  status: 'Pendiente' | 'EnProceso' | 'Completado' | 'Omitido';
  specialistId?: string;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
}

export interface RouteSheet {
  generatedAt: Date;
  stations: {
    order: number;
    location: string;
    examName: string;
    estimatedTime: number;
  }[];
}

// Certificate types
export interface Certificate {
  _id: string;
  certificateNumber: string;
  appointmentId: string;
  patientId: string | Patient;
  companyId: string | Company;
  clinicalRecordId: string;
  certificateType: 'Ingreso' | 'Periodico' | 'Retiro' | 'PostIncapacidad' | 'CambioLabor' | 'Reintegro';
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
  doctorId: string;
  doctorSignatureUrl: string;
  doctorProfessionalCard: string;
  doctorSpecialty: string;
  pdfUrl?: string;
  pdfGeneratedAt?: Date;
  qrCode?: string;
  verificationCode?: string;
  isValid: boolean;
  isExpired?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard types
export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  pendingCertificates: number;
  totalCompanies: number;
  todayAppointments: number;
  weeklyAppointments: number;
  monthlyRevenue: number;
  pendingInvoices: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}