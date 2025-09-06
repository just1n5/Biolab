// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biolab', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ==================== MODELOS DE BASE DE DATOS ====================

// Schema de Usuario (Empleados)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['Auxiliar', 'Medico', 'Admin'] 
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Schema de Paciente
const PatientSchema = new mongoose.Schema({
  documentType: { 
    type: String, 
    required: true,
    enum: ['CC', 'TI', 'CE', 'PA', 'RC'] 
  },
  documentNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { 
    type: String, 
    enum: ['M', 'F', 'Otro'] 
  },
  address: { type: String },
  city: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Schema de Visita/Atención
const VisitSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  attentionCode: { type: String, required: true },
  attentionCodeHash: { type: String, required: true },
  codeExpiresAt: { type: Date, required: true },
  examTypes: [{ 
    type: String,
    required: true 
  }],
  results: [{
    fileName: String,
    filePath: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  }],
  status: { 
    type: String, 
    enum: ['Pendiente', 'EnProceso', 'Completado', 'Entregado'],
    default: 'Pendiente' 
  },
  registeredBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Schema de Logs de Auditoría
const AuditLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: String,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

// Modelos
const User = mongoose.model('User', UserSchema);
const Patient = mongoose.model('Patient', PatientSchema);
const Visit = mongoose.model('Visit', VisitSchema);
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

// ==================== CONFIGURACIÓN DE MULTER ====================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'protected_files', 'results');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'));
    }
  }
});

// ==================== MIDDLEWARE DE AUTENTICACIÓN ====================

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'biolab-secret-key-2024');
    
    if (decoded.type === 'patient') {
      req.patient = decoded;
    } else {
      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ error: 'Usuario no válido o inactivo' });
      }
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    if (!roleArray.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
    }
    
    next();
  };
};

// Función auxiliar para registrar auditoría
const logAudit = async (userId, action, entity, entityId, details, req) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
  } catch (error) {
    console.error('Error al registrar auditoría:', error);
  }
};

// ==================== RUTAS API - AUTENTICACIÓN ====================

// Login de Empleados
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const user = await User.findOne({ username });
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        username: user.username 
      },
      process.env.JWT_SECRET || 'biolab-secret-key-2024',
      { expiresIn: '8h' }
    );

    await logAudit(user._id, 'LOGIN', 'User', user._id, { username }, req);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Login de Pacientes
app.post('/api/patient/login', async (req, res) => {
  try {
    const { documentType, documentNumber, attentionCode } = req.body;

    if (!documentType || !documentNumber || !attentionCode) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Buscar paciente
    const patient = await Patient.findOne({ 
      documentType, 
      documentNumber 
    });

    if (!patient) {
      return res.status(401).json({ error: 'Código o documento inválido' });
    }

    // Buscar visita activa
    const visit = await Visit.findOne({ 
      patientId: patient._id,
      codeExpiresAt: { $gt: new Date() }
    });

    if (!visit) {
      return res.status(401).json({ error: 'No hay resultados disponibles' });
    }

    // Verificar código
    const isCodeValid = await bcrypt.compare(attentionCode, visit.attentionCodeHash);
    
    if (!isCodeValid) {
      return res.status(401).json({ error: 'Código de atención inválido' });
    }

    // Generar token temporal
    const token = jwt.sign(
      { 
        type: 'patient',
        patientId: patient._id,
        visitId: visit._id 
      },
      process.env.JWT_SECRET || 'biolab-secret-key-2024',
      { expiresIn: '1h' }
    );

    await logAudit(null, 'PATIENT_LOGIN', 'Visit', visit._id, { 
      patientDocument: documentNumber 
    }, req);

    res.json({
      success: true,
      token,
      visit: {
        id: visit._id,
        examTypes: visit.examTypes,
        status: visit.status,
        hasResults: visit.results.length > 0
      }
    });
  } catch (error) {
    console.error('Error en login de paciente:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ==================== RUTAS API - GESTIÓN DE PACIENTES ====================

// Registrar nuevo paciente y visita
app.post('/api/patients/register', isAuthenticated, hasRole(['Auxiliar', 'Medico', 'Admin']), async (req, res) => {
  try {
    const { 
      documentType, documentNumber, firstName, lastName, 
      email, phone, birthDate, gender, address, city,
      examTypes, notes 
    } = req.body;

    // Verificar si el paciente ya existe
    let patient = await Patient.findOne({ documentNumber });
    
    if (!patient) {
      // Crear nuevo paciente
      patient = await Patient.create({
        documentType,
        documentNumber,
        firstName,
        lastName,
        email,
        phone,
        birthDate,
        gender,
        address,
        city
      });
    }

    // Generar código de atención único
    const attentionCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const attentionCodeHash = await bcrypt.hash(attentionCode, 10);
    
    // Crear visita
    const visit = await Visit.create({
      patientId: patient._id,
      attentionCode: attentionCode, // Solo para mostrarlo una vez
      attentionCodeHash,
      codeExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      examTypes,
      notes,
      registeredBy: req.user._id
    });

    await logAudit(req.user._id, 'REGISTER_PATIENT', 'Visit', visit._id, { 
      patientId: patient._id,
      examTypes 
    }, req);

    res.json({
      success: true,
      message: 'Paciente registrado exitosamente',
      patient: {
        id: patient._id,
        fullName: `${patient.firstName} ${patient.lastName}`,
        document: patient.documentNumber
      },
      visit: {
        id: visit._id,
        attentionCode: attentionCode, // IMPORTANTE: Solo se envía una vez
        expiresAt: visit.codeExpiresAt
      }
    });
  } catch (error) {
    console.error('Error al registrar paciente:', error);
    res.status(500).json({ error: 'Error al registrar paciente' });
  }
});

// Búsqueda de pacientes
app.get('/api/patients/search', isAuthenticated, hasRole(['Medico', 'Admin']), async (req, res) => {
  try {
    const { name, doc, dateStart, dateEnd, status } = req.query;
    
    let query = {};
    
    // Construir query de búsqueda
    if (name) {
      query.$or = [
        { firstName: new RegExp(name, 'i') },
        { lastName: new RegExp(name, 'i') }
      ];
    }
    
    if (doc) {
      query.documentNumber = new RegExp(doc, 'i');
    }
    
    // Buscar pacientes
    const patients = await Patient.find(query);
    const patientIds = patients.map(p => p._id);
    
    // Construir query para visitas
    let visitQuery = { patientId: { $in: patientIds } };
    
    if (dateStart || dateEnd) {
      visitQuery.createdAt = {};
      if (dateStart) visitQuery.createdAt.$gte = new Date(dateStart);
      if (dateEnd) visitQuery.createdAt.$lte = new Date(dateEnd);
    }
    
    if (status) {
      visitQuery.status = status;
    }
    
    // Buscar visitas con información del paciente
    const visits = await Visit.find(visitQuery)
      .populate('patientId', 'firstName lastName documentNumber phone email')
      .populate('registeredBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      results: visits.map(visit => ({
        visitId: visit._id,
        patient: {
          id: visit.patientId._id,
          fullName: `${visit.patientId.firstName} ${visit.patientId.lastName}`,
          document: visit.patientId.documentNumber,
          phone: visit.patientId.phone,
          email: visit.patientId.email
        },
        examTypes: visit.examTypes,
        status: visit.status,
        hasResults: visit.results.length > 0,
        resultsCount: visit.results.length,
        registeredBy: visit.registeredBy?.fullName,
        createdAt: visit.createdAt
      }))
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

// ==================== RUTAS API - GESTIÓN DE RESULTADOS ====================

// Subir resultado
app.post('/api/visits/:visitId/upload', 
  isAuthenticated, 
  hasRole(['Medico', 'Admin']),
  upload.single('result'),
  async (req, res) => {
    try {
      const { visitId } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
      }

      const visit = await Visit.findById(visitId);
      
      if (!visit) {
        fs.unlinkSync(req.file.path); // Eliminar archivo si no existe la visita
        return res.status(404).json({ error: 'Visita no encontrada' });
      }

      // Agregar resultado a la visita
      visit.results.push({
        fileName: req.file.originalname,
        filePath: req.file.path,
        uploadedBy: req.user._id
      });

      if (visit.status === 'Pendiente') {
        visit.status = 'EnProceso';
      }

      await visit.save();

      await logAudit(req.user._id, 'UPLOAD_RESULT', 'Visit', visitId, { 
        fileName: req.file.originalname 
      }, req);

      res.json({
        success: true,
        message: 'Resultado subido exitosamente',
        result: {
          fileName: req.file.originalname,
          uploadedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error al subir resultado:', error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Error al subir el resultado' });
    }
});

// Obtener resultados (para pacientes)
app.get('/api/results/:visitId', isAuthenticated, async (req, res) => {
  try {
    const { visitId } = req.params;
    
    // Verificar que es un paciente y tiene acceso a esta visita
    if (req.patient && req.patient.visitId !== visitId) {
      return res.status(403).json({ error: 'No tiene acceso a estos resultados' });
    }

    const visit = await Visit.findById(visitId)
      .populate('patientId', 'firstName lastName documentNumber');

    if (!visit) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }

    if (visit.results.length === 0) {
      return res.status(404).json({ error: 'No hay resultados disponibles aún' });
    }

    // Obtener el resultado más reciente
    const latestResult = visit.results[visit.results.length - 1];
    
    if (!fs.existsSync(latestResult.filePath)) {
      return res.status(404).json({ error: 'Archivo de resultados no encontrado' });
    }

    // Enviar el archivo PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${latestResult.fileName}"`);
    
    const fileStream = fs.createReadStream(latestResult.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    res.status(500).json({ error: 'Error al obtener los resultados' });
  }
});

// Eliminar resultado
app.delete('/api/visits/:visitId/results/:resultId', 
  isAuthenticated, 
  hasRole(['Medico', 'Admin']), 
  async (req, res) => {
    try {
      const { visitId, resultId } = req.params;

      const visit = await Visit.findById(visitId);
      
      if (!visit) {
        return res.status(404).json({ error: 'Visita no encontrada' });
      }

      const resultIndex = visit.results.findIndex(r => r._id.toString() === resultId);
      
      if (resultIndex === -1) {
        return res.status(404).json({ error: 'Resultado no encontrado' });
      }

      const result = visit.results[resultIndex];
      
      // Eliminar archivo físico
      if (fs.existsSync(result.filePath)) {
        fs.unlinkSync(result.filePath);
      }

      // Eliminar de la base de datos
      visit.results.splice(resultIndex, 1);
      await visit.save();

      await logAudit(req.user._id, 'DELETE_RESULT', 'Visit', visitId, { 
        resultId,
        fileName: result.fileName 
      }, req);

      res.json({
        success: true,
        message: 'Resultado eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar resultado:', error);
      res.status(500).json({ error: 'Error al eliminar el resultado' });
    }
});

// ==================== RUTAS API - INFORMACIÓN DE VISITA ====================

// Obtener detalles de visita
app.get('/api/visits/:visitId', isAuthenticated, hasRole(['Medico', 'Admin']), async (req, res) => {
  try {
    const { visitId } = req.params;

    const visit = await Visit.findById(visitId)
      .populate('patientId')
      .populate('registeredBy', 'fullName')
      .populate('results.uploadedBy', 'fullName');

    if (!visit) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }

    res.json({
      success: true,
      visit: {
        id: visit._id,
        patient: {
          id: visit.patientId._id,
          documentType: visit.patientId.documentType,
          documentNumber: visit.patientId.documentNumber,
          fullName: `${visit.patientId.firstName} ${visit.patientId.lastName}`,
          email: visit.patientId.email,
          phone: visit.patientId.phone,
          birthDate: visit.patientId.birthDate,
          gender: visit.patientId.gender,
          address: visit.patientId.address,
          city: visit.patientId.city
        },
        examTypes: visit.examTypes,
        status: visit.status,
        notes: visit.notes,
        results: visit.results.map(r => ({
          id: r._id,
          fileName: r.fileName,
          uploadedAt: r.uploadedAt,
          uploadedBy: r.uploadedBy?.fullName
        })),
        registeredBy: visit.registeredBy?.fullName,
        createdAt: visit.createdAt,
        codeExpiresAt: visit.codeExpiresAt
      }
    });
  } catch (error) {
    console.error('Error al obtener detalles de visita:', error);
    res.status(500).json({ error: 'Error al obtener los detalles' });
  }
});

// ==================== INICIALIZACIÓN DEL SERVIDOR ====================

// Crear usuario admin por defecto si no existe
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@biolabsas.com',
        fullName: 'Administrador Sistema',
        role: 'Admin'
      });
      console.log('Usuario admin creado por defecto');
    }
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
  }
};

// Iniciar servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await createDefaultAdmin();
});

module.exports = app;
