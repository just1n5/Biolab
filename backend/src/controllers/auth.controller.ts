import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User, { UserRole, IUser } from '../models/User';
import AuditLog, { AuditAction, AuditEntity } from '../models/AuditLog';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { logInfo, logError, logSecurity } from '../utils/logger';

// Login de usuario
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    logInfo(`Intento de login para: ${email}`);
    console.log('Login attempt:', { email, passwordLength: password?.length });
    
    // Buscar usuario con contraseña
    const user = await User.findOne({ email }).select('+password +refreshToken');
    
    if (!user) {
      logInfo(`Usuario no encontrado: ${email}`);
      console.log('User not found:', email);
      
      // Log de intento fallido
      await AuditLog.createLog({
        actorId: null as any,
        actorEmail: email,
        actorRole: 'Unknown',
        actorIp: req.ip,
        actorUserAgent: req.headers['user-agent'],
        action: AuditAction.LOGIN_FAILED,
        entity: AuditEntity.USER,
        result: 'FAILURE',
        errorMessage: 'Usuario no encontrado',
        timestamp: new Date(),
      });
      
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }
    
    console.log('User found:', { 
      email: user.email, 
      hasPassword: !!user.password,
      isActive: user.isActive 
    });
    
    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      logInfo(`Contraseña incorrecta para: ${email}`);
      
      // Log de intento fallido
      await AuditLog.createLog({
        actorId: user._id as any,
        actorEmail: email,
        actorRole: user.role,
        actorIp: req.ip,
        actorUserAgent: req.headers['user-agent'],
        action: AuditAction.LOGIN_FAILED,
        entity: AuditEntity.USER,
        entityId: user._id.toString(),
        result: 'FAILURE',
        errorMessage: 'Contraseña incorrecta',
        timestamp: new Date(),
      });
      
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }
    
    // Verificar si el usuario está activo
    if (!user.isActive) {
      logInfo(`Usuario inactivo intentó iniciar sesión: ${email}`);
      res.status(403).json({
        success: false,
        message: 'Tu cuenta está desactivada. Contacta al administrador.',
      });
      return;
    }
    
    // Generar tokens
    const tokens = generateTokens({
      _id: user._id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      permissions: user.permissions,
    });
    
    // Guardar refresh token
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    // Log de login exitoso
    await AuditLog.createLog({
      actorId: user._id as any,
      actorEmail: user.email,
      actorRole: user.role,
      actorIp: req.ip,
      actorUserAgent: req.headers['user-agent'],
      action: AuditAction.LOGIN,
      entity: AuditEntity.USER,
      entityId: user._id.toString(),
      result: 'SUCCESS',
      timestamp: new Date(),
    });
    
    logInfo(`Usuario ${user.email} inició sesión exitosamente`);
    console.log('Login successful for:', user.email);
    
    // Remover datos sensibles antes de enviar
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;
    
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: userObject,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    logError('Error en login', error);
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, role, companyId, documentNumber, phone, specialty } = req.body;
    
    logInfo(`Intento de registro para: ${email}`);
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
      });
      return;
    }
    
    // Validaciones adicionales por rol
    if (role === UserRole.EMPRESA_RRHH && !companyId) {
      res.status(400).json({
        success: false,
        message: 'El ID de empresa es requerido para usuarios de RRHH',
      });
      return;
    }
    
    if (role === UserRole.MEDICO && !specialty) {
      res.status(400).json({
        success: false,
        message: 'La especialidad es requerida para médicos',
      });
      return;
    }
    
    // Crear nuevo usuario
    const newUser = new User({
      email,
      password, // Se hasheará automáticamente en el pre-save hook
      fullName,
      role,
      companyId,
      documentNumber,
      phone,
      specialty,
      isActive: true,
    });
    
    await newUser.save();
    
    // Generar tokens
    const tokens = generateTokens({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      companyId: newUser.companyId,
      permissions: newUser.permissions,
    });
    
    // Guardar refresh token
    newUser.refreshToken = tokens.refreshToken;
    newUser.lastLogin = new Date();
    await newUser.save();
    
    // Log de registro exitoso
    await AuditLog.createLog({
      actorId: newUser._id as any,
      actorEmail: newUser.email,
      actorRole: newUser.role,
      actorIp: req.ip,
      actorUserAgent: req.headers['user-agent'],
      action: AuditAction.CREATE,
      entity: AuditEntity.USER,
      entityId: newUser._id.toString(),
      result: 'SUCCESS',
      newData: { email, fullName, role },
      timestamp: new Date(),
    });
    
    logInfo(`Nuevo usuario registrado: ${newUser.email}`);
    
    // Remover datos sensibles antes de enviar
    const userObject = newUser.toObject();
    delete userObject.password;
    delete userObject.refreshToken;
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: userObject,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    logError('Error en registro', error);
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    // Limpiar refresh token
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });
    
    // Log de logout
    await AuditLog.createLog({
      actorId: userId as any,
      actorEmail: req.user?.email || '',
      actorRole: req.userRole || '',
      actorIp: req.ip,
      actorUserAgent: req.headers['user-agent'],
      action: AuditAction.LOGOUT,
      entity: AuditEntity.USER,
      entityId: userId,
      result: 'SUCCESS',
      timestamp: new Date(),
    });
    
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    logError('Error en logout', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
    });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token requerido',
      });
      return;
    }
    
    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Buscar usuario
    const user = await User.findById(decoded.userId).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token inválido',
      });
      return;
    }
    
    // Generar nuevos tokens
    const tokens = generateTokens({
      _id: user._id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      permissions: user.permissions,
    });
    
    // Guardar nuevo refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    logError('Error en refresh token', error);
    res.status(401).json({
      success: false,
      message: 'Error al refrescar token',
    });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // No revelar si el usuario existe o no
      res.status(200).json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña',
      });
      return;
    }
    
    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();
    
    // Aquí deberías enviar el email con el token
    // Por ahora solo lo logueamos
    logInfo(`Token de reset generado para ${email}: ${resetToken}`);
    
    // Log de solicitud de reset
    await AuditLog.createLog({
      actorId: user._id as any,
      actorEmail: user.email,
      actorRole: user.role,
      actorIp: req.ip,
      actorUserAgent: req.headers['user-agent'],
      action: AuditAction.PASSWORD_RESET,
      entity: AuditEntity.USER,
      entityId: user._id.toString(),
      result: 'SUCCESS',
      entityDescription: 'Solicitud de reset de contraseña',
      timestamp: new Date(),
    });
    
    res.status(200).json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña',
      // En desarrollo, incluir el token
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    logError('Error en forgot password', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud',
    });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    
    // Hash del token recibido
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Buscar usuario con token válido
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');
    
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
      });
      return;
    }
    
    // Actualizar contraseña
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    // Log de cambio de contraseña
    await AuditLog.createLog({
      actorId: user._id as any,
      actorEmail: user.email,
      actorRole: user.role,
      actorIp: req.ip,
      actorUserAgent: req.headers['user-agent'],
      action: AuditAction.PASSWORD_CHANGE,
      entity: AuditEntity.USER,
      entityId: user._id.toString(),
      result: 'SUCCESS',
      entityDescription: 'Contraseña restablecida con token',
      timestamp: new Date(),
    });
    
    logSecurity('Contraseña restablecida', {
      userId: user._id,
      email: user.email,
      ip: req.ip,
    });
    
    res.status(200).json({
      success: true,
      message: 'Contraseña restablecida exitosamente',
    });
  } catch (error) {
    logError('Error en reset password', error);
    res.status(500).json({
      success: false,
      message: 'Error al restablecer contraseña',
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    
    // Buscar usuario con contraseña
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }
    
    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta',
      });
      return;
    }
    
    // Actualizar contraseña
    user.password = newPassword;
    await user.save();
    
    // Log de cambio de contraseña
    await AuditLog.createLog({
      actorId: user._id as any,
      actorEmail: user.email,
      actorRole: user.role,
      actorIp: req.ip,
      actorUserAgent: req.headers['user-agent'],
      action: AuditAction.PASSWORD_CHANGE,
      entity: AuditEntity.USER,
      entityId: user._id.toString(),
      result: 'SUCCESS',
      entityDescription: 'Contraseña cambiada por el usuario',
      timestamp: new Date(),
    });
    
    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    logError('Error en change password', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
    });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId)
      .populate('companyId', 'name nit')
      .select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logError('Error al obtener usuario actual', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
    });
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { fullName, phone, profilePhoto } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        phone,
        profilePhoto,
      },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
      return;
    }
    
    // Log de actualización
    await AuditLog.createLog({
      actorId: user._id as any,
      actorEmail: user.email,
      actorRole: user.role,
      actorIp: req.ip,
      actorUserAgent: req.headers['user-agent'],
      action: AuditAction.UPDATE,
      entity: AuditEntity.USER,
      entityId: user._id.toString(),
      result: 'SUCCESS',
      changedFields: Object.keys(req.body),
      timestamp: new Date(),
    });
    
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user,
    });
  } catch (error) {
    logError('Error al actualizar perfil', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
    });
  }
};