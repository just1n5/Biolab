import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Building2,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAuthStore from '@/store/authStore';
import { UserRole } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalPatients: 1234,
    todayAppointments: 45,
    pendingCertificates: 12,
    monthlyRevenue: 125000000,
    activeCompanies: 23,
    completedExams: 892,
  });

  // Mock data for charts
  const appointmentTrend = [
    { name: 'Lun', value: 45 },
    { name: 'Mar', value: 52 },
    { name: 'Mie', value: 48 },
    { name: 'Jue', value: 58 },
    { name: 'Vie', value: 62 },
    { name: 'Sab', value: 30 },
  ];

  const examTypes = [
    { name: 'Médico General', value: 35, color: '#00B7B7' },
    { name: 'Optometría', value: 25, color: '#31A3DD' },
    { name: 'Audiometría', value: 20, color: '#136EBF' },
    { name: 'Laboratorio', value: 20, color: '#777777' },
  ];

  const recentActivities = [
    { id: 1, type: 'appointment', message: 'Nueva cita agendada - Juan Pérez', time: 'Hace 5 min' },
    { id: 2, type: 'certificate', message: 'Certificado generado - María González', time: 'Hace 15 min' },
    { id: 3, type: 'payment', message: 'Pago recibido - Constructora ABC', time: 'Hace 1 hora' },
    { id: 4, type: 'exam', message: 'Resultados de laboratorio listos - Carlos Rodríguez', time: 'Hace 2 horas' },
  ];

  const statCards = [
    {
      title: 'Pacientes Totales',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-biolab-turquoise',
      bgColor: 'bg-biolab-turquoise/10',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Citas Hoy',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-biolab-blue-light',
      bgColor: 'bg-biolab-blue-light/10',
      change: '+5',
      changeType: 'positive',
    },
    {
      title: 'Certificados Pendientes',
      value: stats.pendingCertificates,
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      change: '-3',
      changeType: 'negative',
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: '+18%',
      changeType: 'positive',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-biolab-blue" />;
      case 'certificate':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case 'exam':
        return <Activity className="h-4 w-4 text-biolab-turquoise" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-biolab-turquoise to-biolab-blue rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenido, {user?.fullName}
        </h1>
        <p className="text-white/90">
          {new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <span
                          className={`text-sm font-medium ${
                            stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs mes anterior</span>
                      </div>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Citas</CardTitle>
            <CardDescription>Últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appointmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00B7B7"
                  strokeWidth={2}
                  dot={{ fill: '#00B7B7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exam Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Exámenes</CardTitle>
            <CardDescription>Este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={examTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {examTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actualizaciones del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos frecuentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-biolab-turquoise/10 rounded-lg hover:bg-biolab-turquoise/20 transition-colors">
                <Calendar className="h-8 w-8 text-biolab-turquoise mx-auto mb-2" />
                <p className="text-sm font-medium">Nueva Cita</p>
              </button>
              <button className="p-4 bg-biolab-blue-light/10 rounded-lg hover:bg-biolab-blue-light/20 transition-colors">
                <Users className="h-8 w-8 text-biolab-blue-light mx-auto mb-2" />
                <p className="text-sm font-medium">Registrar Paciente</p>
              </button>
              <button className="p-4 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors">
                <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Generar Certificado</p>
              </button>
              <button className="p-4 bg-orange-500/10 rounded-lg hover:bg-orange-500/20 transition-colors">
                <Activity className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Ver Resultados</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;