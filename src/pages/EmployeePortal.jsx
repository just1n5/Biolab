// src/pages/EmployeePortal.jsx - Portal principal de empleados
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, LogOut, Menu, X, Users, FileText, Upload, 
  Search, Calendar, Activity, AlertCircle, CheckCircle,
  Clock, Loader2, Plus, Eye, Trash2, Download
} from 'lucide-react';

// ==================== COMPONENTE DE LOGIN ====================
const EmployeeLogin = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      localStorage.setItem('employeeToken', data.token);
      localStorage.setItem('employeeData', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-biolab-turquoise/5 via-white to-biolab-blue-light/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light p-6 text-white">
            <h2 className="text-2xl font-bold">Portal Empresarial</h2>
            <p className="text-white/90 mt-1">Acceso exclusivo para empleados</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} />
                Usuario
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Lock size={16} />
                Contraseña
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white rounded-lg hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== DASHBOARD DE AUXILIAR ====================
const AuxiliaryDashboard = ({ user, token, onLogout }) => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [patientData, setPatientData] = useState({
    documentType: 'CC',
    documentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'M',
    address: '',
    city: '',
    examTypes: [],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState('');

  const examOptions = [
    'Hemograma', 'Glicemia', 'Creatinina', 'Colesterol Total',
    'Triglicéridos', 'HDL', 'LDL', 'TSH', 'T4 Libre',
    'Parcial de Orina', 'Coprológico', 'PT', 'PTT'
  ];

  const handleExamToggle = (exam) => {
    setPatientData(prev => ({
      ...prev,
      examTypes: prev.examTypes.includes(exam)
        ? prev.examTypes.filter(e => e !== exam)
        : [...prev.examTypes, exam]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/patients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar paciente');
      }

      setSuccessMessage({
        patient: data.patient,
        visit: data.visit
      });

      // Limpiar formulario
      setPatientData({
        documentType: 'CC',
        documentNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'M',
        address: '',
        city: '',
        examTypes: [],
        notes: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Auxiliar</h1>
              <p className="text-sm text-gray-600">Bienvenido, {user.fullName}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pacientes Hoy</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <Users className="text-biolab-turquoise" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Espera</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-3xl font-bold text-gray-900">9</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <button
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Registrar Nuevo Paciente
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 mb-2">
                  ¡Paciente registrado exitosamente!
                </h3>
                <p className="text-green-700 mb-3">
                  Paciente: {successMessage.patient.fullName} - Doc: {successMessage.patient.document}
                </p>
                <div className="bg-white rounded-lg p-4 border border-green-300">
                  <p className="text-sm text-gray-600 mb-2">
                    Código de atención (entregar al paciente):
                  </p>
                  <p className="text-2xl font-mono font-bold text-green-600">
                    {successMessage.visit.attentionCode}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Válido hasta: {new Date(successMessage.visit.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Registration Form */}
        <AnimatePresence>
          {showRegisterForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Registro de Nuevo Paciente
              </h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos Personales */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Datos Personales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Documento
                      </label>
                      <select
                        value={patientData.documentType}
                        onChange={(e) => setPatientData({ ...patientData, documentType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                      >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PA">Pasaporte</option>
                        <option value="RC">Registro Civil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Documento
                      </label>
                      <input
                        type="text"
                        value={patientData.documentNumber}
                        onChange={(e) => setPatientData({ ...patientData, documentNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombres
                      </label>
                      <input
                        type="text"
                        value={patientData.firstName}
                        onChange={(e) => setPatientData({ ...patientData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellidos
                      </label>
                      <input
                        type="text"
                        value={patientData.lastName}
                        onChange={(e) => setPatientData({ ...patientData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        value={patientData.birthDate}
                        onChange={(e) => setPatientData({ ...patientData, birthDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Género
                      </label>
                      <select
                        value={patientData.gender}
                        onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                      >
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={patientData.phone}
                        onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={patientData.email}
                        onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={patientData.address}
                        onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={patientData.city}
                        onChange={(e) => setPatientData({ ...patientData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                      />
                    </div>
                  </div>
                </div>

                {/* Exámenes */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Exámenes a Realizar
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {examOptions.map(exam => (
                      <label
                        key={exam}
                        className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={patientData.examTypes.includes(exam)}
                          onChange={() => handleExamToggle(exam)}
                          className="text-biolab-turquoise focus:ring-biolab-turquoise"
                        />
                        <span className="text-sm">{exam}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas adicionales
                  </label>
                  <textarea
                    value={patientData.notes}
                    onChange={(e) => setPatientData({ ...patientData, notes: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
                    placeholder="Observaciones, condiciones especiales, etc."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || patientData.examTypes.length === 0}
                    className="px-6 py-2 bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Registrando...
                      </span>
                    ) : (
                      'Registrar Paciente'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// ==================== DASHBOARD DE MÉDICO ====================
const MedicDashboard = ({ user, token, onLogout }) => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    doc: '',
    dateStart: '',
    dateEnd: '',
    status: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.entries(searchParams).filter(([_, v]) => v !== '')
      );
      
      const response = await fetch(`http://localhost:5000/api/patients/search?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (visitId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/visits/${visitId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedVisit(data.visit);
      }
    } catch (err) {
      console.error('Error al cargar detalles:', err);
    }
  };

  const handleUploadResult = async () => {
    if (!uploadFile || !selectedVisit) return;

    const formData = new FormData();
    formData.append('result', uploadFile);

    try {
      const response = await fetch(`http://localhost:5000/api/visits/${selectedVisit.id}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        // Recargar detalles de la visita
        handleViewDetails(selectedVisit.id);
        setUploadFile(null);
      }
    } catch (err) {
      console.error('Error al subir resultado:', err);
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (!confirm('¿Está seguro de eliminar este resultado?')) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/visits/${selectedVisit.id}/results/${resultId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        handleViewDetails(selectedVisit.id);
      }
    } catch (err) {
      console.error('Error al eliminar resultado:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Médico</h1>
              <p className="text-sm text-gray-600">Dr. {user.fullName}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search size={20} />
            Búsqueda de Pacientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nombre del paciente"
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
            />
            <input
              type="text"
              placeholder="Documento"
              value={searchParams.doc}
              onChange={(e) => setSearchParams({ ...searchParams, doc: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
            />
            <select
              value={searchParams.status}
              onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="EnProceso">En Proceso</option>
              <option value="Completado">Completado</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white rounded-lg hover:shadow-lg"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* Results Table */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paciente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Documento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Exámenes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searchResults.map((result) => (
                  <tr key={result.visitId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{result.patient.fullName}</td>
                    <td className="px-4 py-3">{result.patient.document}</td>
                    <td className="px-4 py-3 text-sm">{result.examTypes.join(', ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.status === 'Completado' ? 'bg-green-100 text-green-800' :
                        result.status === 'EnProceso' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewDetails(result.visitId)}
                        className="text-biolab-turquoise hover:text-biolab-blue-light"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Patient Details Modal */}
        {selectedVisit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">Detalles del Paciente</h2>
                  <button
                    onClick={() => setSelectedVisit(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Patient Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium">{selectedVisit.patient.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Documento</p>
                    <p className="font-medium">
                      {selectedVisit.patient.documentType} {selectedVisit.patient.documentNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{selectedVisit.patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedVisit.patient.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Results Section */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Resultados</h3>
                  
                  {selectedVisit.results.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {selectedVisit.results.map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{result.fileName}</p>
                            <p className="text-xs text-gray-500">
                              Subido: {new Date(result.uploadedAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteResult(result.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-4">No hay resultados subidos</p>
                  )}

                  {/* Upload Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Subir nuevo resultado</h4>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        className="flex-1"
                      />
                      <button
                        onClick={handleUploadResult}
                        disabled={!uploadFile}
                        className="px-4 py-2 bg-biolab-turquoise text-white rounded hover:bg-biolab-blue-light disabled:opacity-50"
                      >
                        <Upload size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
const EmployeePortal = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedToken = localStorage.getItem('employeeToken');
    const savedUser = localStorage.getItem('employeeData');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeData');
    setUser(null);
    setToken(null);
  };

  // Si no hay usuario logueado, mostrar login
  if (!user || !token) {
    return <EmployeeLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Mostrar dashboard según el rol
  if (user.role === 'Auxiliar') {
    return <AuxiliaryDashboard user={user} token={token} onLogout={handleLogout} />;
  }

  if (user.role === 'Medico' || user.role === 'Admin') {
    return <MedicDashboard user={user} token={token} onLogout={handleLogout} />;
  }

  // Fallback para otros roles
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Rol no reconocido: {user.role}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default EmployeePortal;
