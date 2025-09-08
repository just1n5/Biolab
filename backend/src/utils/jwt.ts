import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Interface para el payload del token
export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
  permissions?: string[];
}

// Interface para el token decodificado
export interface IDecodedToken extends ITokenPayload {
  iat: number;
  exp: number;
}

// Generar Access Token
export const generateAccessToken = (payload: ITokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-change-this';
  const expiresIn = process.env.JWT_EXPIRE || '24h';
  
  return jwt.sign(payload, secret, { expiresIn });
};

// Generar Refresh Token
export const generateRefreshToken = (payload: ITokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-this';
  const expiresIn = process.env.JWT_REFRESH_EXPIRE || '7d';
  
  return jwt.sign(payload, secret, { expiresIn });
};

// Verificar Access Token
export const verifyAccessToken = (token: string): IDecodedToken => {
  const secret = process.env.JWT_SECRET || 'default-secret-change-this';
  
  try {
    return jwt.verify(token, secret) as IDecodedToken;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

// Verificar Refresh Token
export const verifyRefreshToken = (token: string): IDecodedToken => {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-this';
  
  try {
    return jwt.verify(token, secret) as IDecodedToken;
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};

// Generar tokens para un usuario
export const generateTokens = (user: {
  _id: Types.ObjectId | string;
  email: string;
  role: string;
  companyId?: Types.ObjectId | string;
  permissions?: string[];
}): { accessToken: string; refreshToken: string } => {
  const payload: ITokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    companyId: user.companyId?.toString(),
    permissions: user.permissions,
  };
  
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

// Extraer token del header Authorization
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
};

// Decodificar token sin verificar (útil para debugging)
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};