import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Users,
  Calendar,
  Building2,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  UserCircle,
  ChevronDown,
  Bell,
  Search,
  FlaskConical,
  ClipboardList,
  Stethoscope,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Pacientes',
    href: '/patients',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.RECEPCION, UserRole.MEDICO, UserRole.LABORATORIO],
  },
  {
    name: 'Citas',
    href: '/appointments',
    icon: Calendar,
    roles: [UserRole.ADMIN, UserRole.RECEPCION, UserRole.MEDICO, UserRole.EMPRESA_RRHH],
  },
  {
    name: 'Historia Clínica',
    href: '/clinical-records',
    icon: ClipboardList,
    roles: [UserRole.ADMIN, UserRole.MEDICO],
  },
  {
    name: 'Laboratorio',
    href: '/laboratory',
    icon: FlaskConical,
    roles: [UserRole.ADMIN, UserRole.LABORATORIO, UserRole.MEDICO],
  },
  {
    name: 'Certificados',
    href: '/certificates',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.MEDICO, UserRole.EMPRESA_RRHH],
  },
  {
    name: 'Empresas',
    href: '/companies',
    icon: Building2,
    roles: [UserRole.ADMIN, UserRole.GERENCIA, UserRole.FACTURACION],
  },
  {
    name: 'Facturación',
    href: '/invoices',
    icon: Receipt,
    roles: [UserRole.ADMIN, UserRole.FACTURACION, UserRole.GERENCIA],
  },
  {
    name: 'Reportes',
    href: '/reports',
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.GERENCIA],
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    roles: [UserRole.ADMIN],
  },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || (user && hasRole(item.roles))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-biolab-turquoise" />
            <span className="text-xl font-bold text-gray-800">BIOLAB</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-biolab-turquoise text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar pacientes, citas, certificados..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-biolab-turquoise"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="h-8 w-8 bg-biolab-turquoise rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.fullName?.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden md:block font-medium">{user?.fullName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border overflow-hidden z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserCircle className="h-5 w-5" />
                        <span>Mi Perfil</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5" />
                        <span>Configuración</span>
                      </Link>
                      <hr />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-3 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}