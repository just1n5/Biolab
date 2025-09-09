import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, Eye, EyeOff, Activity } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { UserRole } from '@/types';
import toast from 'react-hot-toast';

export default function EmployeePortal() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    try {
      await login(formData.email, formData.password);
      
      // Verificar el rol del usuario después del login
      const userRole = useAuthStore.getState().user?.role;
      
      if (userRole === UserRole.EMPRESA_RRHH) {
        navigate('/dashboard');
      } else {
        toast.error('Acceso denegado. Este portal es solo para empresas.');
        await useAuthStore.getState().logout();
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Credenciales de ejemplo para desarrollo
  const fillDemoCredentials = () => {
    setFormData({
      email: 'maria.rodriguez@constructoraabc.com',
      password: 'BiolabAdmin2025!'
    });
    toast.success('Credenciales de demo cargadas');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-biolab-blue/10 via-white to-biolab-turquoise/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-biolab-blue to-biolab-turquoise p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-center">Portal Empresarial</h2>
            <p className="text-center text-white/90 mt-2">
              Acceso exclusivo para empresas cliente
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-biolab-blue focus:border-transparent"
                  placeholder="usuario@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-biolab-blue focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-biolab-blue to-biolab-turquoise text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Iniciando sesión...
                </span>
              ) : (
                'Ingresar al Portal'
              )}
            </button>

            {/* Demo button for development */}
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full text-sm text-biolab-blue hover:underline"
              >
                Usar credenciales de demo
              </button>
            )}
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
            <p>¿Necesita ayuda?</p>
            <p className="font-semibold">contacto@biolabsas.com</p>
            <p>+57 318 123 4567</p>
          </div>
        </div>

        {/* Logo */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Activity className="h-6 w-6 text-biolab-turquoise" />
            <span className="font-semibold">BIOLAB S.A.S.</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            © 2025 Todos los derechos reservados
          </p>
        </div>
      </motion.div>
    </div>
  );
}