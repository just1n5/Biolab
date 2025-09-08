import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../models/User';
import Company from '../models/Company';
import Profesiogram, { defaultProfesiograms } from '../models/Profesiogram';
import Patient from '../models/Patient';
import connectDB from '../config/database';
import { logInfo, logError } from './logger';

// Cargar variables de entorno
dotenv.config();

// Datos de ejemplo
const seedData = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    logInfo('🌱 Iniciando seed de la base de datos...');
    
    // Limpiar colecciones existentes (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({});
      await Company.deleteMany({});
      await Profesiogram.deleteMany({});
      await Patient.deleteMany({});
      logInfo('📦 Colecciones limpiadas');
    }
    
    // Crear usuario administrador
    const adminPassword = process.env.ADMIN_PASSWORD || 'BiolabAdmin2025!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@biolabsas.com',
      password: hashedPassword,
      fullName: 'Administrador BIOLAB',
      role: UserRole.ADMIN,
      isActive: true,
      permissions: ['all'],
    });
    
    logInfo('👤 Usuario administrador creado');
    
    // Crear empresas de ejemplo
    const companies = await Company.create([
      {
        name: 'Constructora ABC S.A.S',
        nit: '900123456-7',
        address: 'Carrera 10 #20-30, Bogotá',
        phone: '+57 1 234 5678',
        email: 'info@constructoraabc.com',
        contacts: [
          {
            name: 'María Rodríguez',
            position: 'Jefe de RRHH',
            email: 'maria.rodriguez@constructoraabc.com',
            phone: '+57 300 123 4567',
          },
        ],
        isActive: true,
      },
      {
        name: 'Transportes XYZ Ltda',
        nit: '800987654-3',
        address: 'Calle 50 #30-40, Soacha',
        phone: '+57 1 987 6543',
        email: 'contacto@transportesxyz.com',
        contacts: [
          {
            name: 'Carlos Gómez',
            position: 'Coordinador SST',
            email: 'carlos.gomez@transportesxyz.com',
            phone: '+57 310 987 6543',
          },
        ],
        isActive: true,
      },
      {
        name: 'Industrias Metalúrgicas S.A',
        nit: '860123789-0',
        address: 'Autopista Sur Km 15, Soacha',
        phone: '+57 1 456 7890',
        email: 'sst@industriasmetalurgicas.com',
        contacts: [
          {
            name: 'Ana Martínez',
            position: 'Directora de Talento Humano',
            email: 'ana.martinez@industriasmetalurgicas.com',
            phone: '+57 320 456 7890',
          },
        ],
        isActive: true,
      },
    ]);
    
    logInfo(`🏢 ${companies.length} empresas creadas`);
    
    // Crear usuarios de empresa (RRHH)
    const companyUsers = await User.create([
      {
        email: 'maria.rodriguez@constructoraabc.com',
        password: hashedPassword,
        fullName: 'María Rodríguez',
        role: UserRole.EMPRESA_RRHH,
        companyId: companies[0]._id,
        isActive: true,
      },
      {
        email: 'carlos.gomez@transportesxyz.com',
        password: hashedPassword,
        fullName: 'Carlos Gómez',
        role: UserRole.EMPRESA_RRHH,
        companyId: companies[1]._id,
        isActive: true,
      },
    ]);
    
    logInfo(`👥 ${companyUsers.length} usuarios de empresa creados`);
    
    // Crear usuarios internos
    const internalUsers = await User.create([
      {
        email: 'gerencia@biolabsas.com',
        password: hashedPassword,
        fullName: 'Director General',
        role: UserRole.GERENCIA,
        isActive: true,
      },
      {
        email: 'recepcion@biolabsas.com',
        password: hashedPassword,
        fullName: 'Ana López',
        role: UserRole.RECEPCION,
        isActive: true,
      },
      {
        email: 'medico.general@biolabsas.com',
        password: hashedPassword,
        fullName: 'Dr. Juan Pérez',
        role: UserRole.MEDICO,
        specialty: 'Medicina General',
        professionalCard: 'MP123456',
        isActive: true,
      },
      {
        email: 'optometra@biolabsas.com',
        password: hashedPassword,
        fullName: 'Dra. Laura García',
        role: UserRole.MEDICO,
        specialty: 'Optometria',
        professionalCard: 'OP789012',
        isActive: true,
      },
      {
        email: 'fonoaudiologo@biolabsas.com',
        password: hashedPassword,
        fullName: 'Dr. Roberto Silva',
        role: UserRole.MEDICO,
        specialty: 'Fonoaudiologia',
        professionalCard: 'FA345678',
        isActive: true,
      },
      {
        email: 'laboratorio@biolabsas.com',
        password: hashedPassword,
        fullName: 'Bacterióloga Sandra Ruiz',
        role: UserRole.LABORATORIO,
        isActive: true,
      },
      {
        email: 'facturacion@biolabsas.com',
        password: hashedPassword,
        fullName: 'Pedro Jiménez',
        role: UserRole.FACTURACION,
        isActive: true,
      },
    ]);
    
    logInfo(`👨‍⚕️ ${internalUsers.length} usuarios internos creados`);
    
    // Crear profesiogramas predeterminados
    const profesiograms = await Profesiogram.create(
      defaultProfesiograms.map(p => ({
        ...p,
        createdBy: adminUser._id,
        isActive: true,
        isDefault: true,
      }))
    );
    
    logInfo(`📋 ${profesiograms.length} profesiogramas creados`);
    
    // Asignar profesiogramas a empresas
    for (const company of companies) {
      company.profesiograms = profesiograms.map(p => p._id);
      await company.save();
    }
    
    // Crear pacientes de ejemplo
    const patients = await Patient.create([
      {
        documentNumber: '1234567890',
        documentType: 'CC',
        firstName: 'Juan',
        lastName: 'Martínez',
        birthDate: new Date('1990-05-15'),
        gender: 'M',
        email: 'juan.martinez@example.com',
        phone: '+57 300 111 2222',
        address: 'Calle 10 #20-30',
        city: 'Soacha',
        department: 'Cundinamarca',
        companyId: companies[0]._id,
        occupation: 'Operario de Construcción',
        isActive: true,
      },
      {
        documentNumber: '9876543210',
        documentType: 'CC',
        firstName: 'María',
        lastName: 'González',
        birthDate: new Date('1985-08-20'),
        gender: 'F',
        email: 'maria.gonzalez@example.com',
        phone: '+57 310 333 4444',
        address: 'Carrera 15 #25-35',
        city: 'Bogotá',
        department: 'Cundinamarca',
        companyId: companies[1]._id,
        occupation: 'Conductora',
        isActive: true,
      },
      {
        documentNumber: '1122334455',
        documentType: 'CC',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        birthDate: new Date('1995-03-10'),
        gender: 'M',
        email: 'carlos.rodriguez@example.com',
        phone: '+57 320 555 6666',
        address: 'Diagonal 30 #40-50',
        city: 'Soacha',
        department: 'Cundinamarca',
        companyId: companies[2]._id,
        occupation: 'Soldador',
        isActive: true,
      },
    ]);
    
    logInfo(`🙍 ${patients.length} pacientes creados`);
    
    // Crear usuario paciente
    const patientUser = await User.create({
      email: 'juan.martinez@example.com',
      password: hashedPassword,
      fullName: 'Juan Martínez',
      role: UserRole.PACIENTE,
      documentNumber: '1234567890',
      isActive: true,
    });
    
    logInfo('✅ Seed completado exitosamente');
    
    // Mostrar información de acceso
    console.log('\n=================================');
    console.log('📋 CREDENCIALES DE ACCESO');
    console.log('=================================');
    console.log('\n🔐 Usuario Administrador:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@biolabsas.com'}`);
    console.log(`   Contraseña: ${adminPassword}`);
    console.log('\n👥 Usuarios de Empresa (RRHH):');
    console.log('   Email: maria.rodriguez@constructoraabc.com');
    console.log('   Email: carlos.gomez@transportesxyz.com');
    console.log(`   Contraseña: ${adminPassword}`);
    console.log('\n👨‍⚕️ Usuario Médico:');
    console.log('   Email: medico.general@biolabsas.com');
    console.log(`   Contraseña: ${adminPassword}`);
    console.log('\n🧑 Usuario Paciente:');
    console.log('   Email: juan.martinez@example.com');
    console.log(`   Contraseña: ${adminPassword}`);
    console.log('\n=================================\n');
    
  } catch (error) {
    logError('Error en seed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logInfo('📴 Conexión a base de datos cerrada');
    process.exit(0);
  }
};

// Ejecutar seed
seedData();