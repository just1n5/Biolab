// seed.js - Script para crear datos de prueba
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biolab', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema definitions (same as in server.js)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true, enum: ['Auxiliar', 'Medico', 'Admin'] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PatientSchema = new mongoose.Schema({
  documentType: { type: String, required: true, enum: ['CC', 'TI', 'CE', 'PA', 'RC'] },
  documentNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ['M', 'F', 'Otro'] },
  address: { type: String },
  city: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const VisitSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  attentionCode: { type: String, required: true },
  attentionCodeHash: { type: String, required: true },
  codeExpiresAt: { type: Date, required: true },
  examTypes: [{ type: String, required: true }],
  results: [{
    fileName: String,
    filePath: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  status: { type: String, enum: ['Pendiente', 'EnProceso', 'Completado', 'Entregado'], default: 'Pendiente' },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Patient = mongoose.model('Patient', PatientSchema);
const Visit = mongoose.model('Visit', VisitSchema);

async function seedDatabase() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    
    // Limpiar base de datos
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Visit.deleteMany({});
    console.log('✅ Base de datos limpiada');

    // Crear usuarios de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@biolabsas.com',
      fullName: 'Administrador Sistema',
      role: 'Admin'
    });

    const medico = await User.create({
      username: 'dr.martinez',
      password: hashedPassword,
      email: 'martinez@biolabsas.com',
      fullName: 'Dr. Carlos Martínez',
      role: 'Medico'
    });

    const auxiliar = await User.create({
      username: 'aux.rodriguez',
      password: hashedPassword,
      email: 'rodriguez@biolabsas.com',
      fullName: 'Ana Rodríguez',
      role: 'Auxiliar'
    });

    console.log('✅ Usuarios creados');

    // Crear pacientes de prueba
    const patient1 = await Patient.create({
      documentType: 'CC',
      documentNumber: '1234567890',
      firstName: 'Juan',
      lastName: 'Pérez García',
      email: 'juan.perez@email.com',
      phone: '3001234567',
      birthDate: new Date('1985-05-15'),
      gender: 'M',
      address: 'Calle 123 #45-67',
      city: 'Bogotá'
    });

    const patient2 = await Patient.create({
      documentType: 'CC',
      documentNumber: '0987654321',
      firstName: 'María',
      lastName: 'González López',
      email: 'maria.gonzalez@email.com',
      phone: '3109876543',
      birthDate: new Date('1990-08-20'),
      gender: 'F',
      address: 'Carrera 45 #67-89',
      city: 'Soacha'
    });

    console.log('✅ Pacientes creados');

    // Crear visitas con códigos de atención
    const attentionCode1 = 'TEST1234';
    const attentionCodeHash1 = await bcrypt.hash(attentionCode1, 10);

    const visit1 = await Visit.create({
      patientId: patient1._id,
      attentionCode: attentionCode1,
      attentionCodeHash: attentionCodeHash1,
      codeExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      examTypes: ['Hemograma', 'Glicemia', 'Creatinina'],
      status: 'Pendiente',
      registeredBy: auxiliar._id,
      notes: 'Paciente en ayunas'
    });

    const attentionCode2 = 'TEST5678';
    const attentionCodeHash2 = await bcrypt.hash(attentionCode2, 10);

    const visit2 = await Visit.create({
      patientId: patient2._id,
      attentionCode: attentionCode2,
      attentionCodeHash: attentionCodeHash2,
      codeExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      examTypes: ['Perfil Lipídico', 'TSH', 'T4 Libre'],
      status: 'Pendiente',
      registeredBy: auxiliar._id
    });

    console.log('✅ Visitas creadas');

    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATOS DE PRUEBA CREADOS EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('\n📝 USUARIOS DE PRUEBA:');
    console.log('   Admin: admin / password123');
    console.log('   Médico: dr.martinez / password123');
    console.log('   Auxiliar: aux.rodriguez / password123');
    
    console.log('\n👥 PACIENTES DE PRUEBA:');
    console.log(`   Paciente 1: ${patient1.documentNumber} - Código: ${attentionCode1}`);
    console.log(`   Paciente 2: ${patient2.documentNumber} - Código: ${attentionCode2}`);
    console.log('\n' + '='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seedDatabase();
