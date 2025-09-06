import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, FileText, Download, Mail, MessageCircle, 
  Lock, User, Calendar, Search, Filter,
  ChevronRight, CheckCircle, Clock, AlertCircle,
  Eye, EyeOff, Shield, Activity, Printer,
  Share2, ArrowLeft, TestTube, Heart, Droplet,
  Brain, TrendingUp, Info, ExternalLink, Phone, MapPin
} from 'lucide-react'

const ResultsModal = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState('login') // 'login', 'list', 'detail'
  const [loginData, setLoginData] = useState({
    documentType: 'CC',
    documentNumber: '',
    accessCode: '',
    rememberMe: false
  })
  const [showAccessCode, setShowAccessCode] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Datos de ejemplo - En producción vendría del backend
  const mockResults = [
    {
      id: 1,
      examType: 'Cuadro Hemático',
      icon: Droplet,
      date: '2025-08-20',
      time: '14:30',
      status: 'ready',
      doctor: 'Dra. María González',
      branch: 'Sede Principal',
      pdfUrl: '#',
      details: {
        hemoglobina: { value: 14.5, unit: 'g/dL', range: '13.5-17.5', status: 'normal' },
        hematocrito: { value: 42, unit: '%', range: '40-50', status: 'normal' },
        leucocitos: { value: 7500, unit: '/mm³', range: '4500-11000', status: 'normal' },
        plaquetas: { value: 250000, unit: '/mm³', range: '150000-400000', status: 'normal' }
      }
    },
    {
      id: 2,
      examType: 'Perfil Lipídico',
      icon: Heart,
      date: '2025-08-20',
      time: '14:30',
      status: 'ready',
      doctor: 'Dr. Juan Pérez',
      branch: 'Sede Norte',
      pdfUrl: '#',
      details: {
        colesterolTotal: { value: 195, unit: 'mg/dL', range: '<200', status: 'normal' },
        hdl: { value: 55, unit: 'mg/dL', range: '>40', status: 'normal' },
        ldl: { value: 110, unit: 'mg/dL', range: '<130', status: 'normal' },
        trigliceridos: { value: 150, unit: 'mg/dL', range: '<150', status: 'warning' }
      }
    },
    {
      id: 3,
      examType: 'Glicemia',
      icon: Activity,
      date: '2025-08-15',
      time: '08:00',
      status: 'ready',
      doctor: 'Dra. Ana Rodríguez',
      branch: 'Sede Principal',
      pdfUrl: '#',
      details: {
        glucosa: { value: 92, unit: 'mg/dL', range: '70-100', status: 'normal' }
      }
    },
    {
      id: 4,
      examType: 'Perfil Tiroideo',
      icon: Brain,
      date: '2025-08-10',
      time: '10:15',
      status: 'processing',
      doctor: 'Dr. Carlos Mendoza',
      branch: 'Sede Sur',
      pdfUrl: null,
      estimatedTime: '24 horas'
    },
    {
      id: 5,
      examType: 'Uroanálisis',
      icon: TestTube,
      date: '2025-08-05',
      time: '09:00',
      status: 'ready',
      doctor: 'Dra. Laura Silva',
      branch: 'Sede Principal',
      pdfUrl: '#'
    }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    // Aquí iría la validación real con el backend
    if (loginData.documentNumber && loginData.accessCode) {
      setCurrentView('list')
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleViewResult = (result) => {
    setSelectedResult(result)
    setCurrentView('detail')
  }

  const handleBack = () => {
    if (currentView === 'detail') {
      setCurrentView('list')
      setSelectedResult(null)
    } else if (currentView === 'list') {
      setCurrentView('login')
    }
  }

  const handleLogout = () => {
    setCurrentView('login')
    setLoginData({
      documentType: 'CC',
      documentNumber: '',
      accessCode: '',
      rememberMe: false
    })
  }

  // Filtrar resultados
  const filteredResults = mockResults.filter(result => {
    const matchesSearch = result.examType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || result.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return (
          <span className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Listo
          </span>
        )
      case 'processing':
        return (
          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" />
            En proceso
          </span>
        )
      case 'pending':
        return (
          <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendiente
          </span>
        )
      default:
        return null
    }
  }

  const getValueStatus = (value, range) => {
    // Lógica simplificada para determinar si un valor está en rango
    return 'normal' // En producción sería más compleja
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-5xl h-[85vh] sm:h-[90vh] max-h-[800px] bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-biolab-turquoise to-biolab-blue p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {currentView !== 'login' && (
                    <button
                      onClick={handleBack}
                      className="mr-3 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-poppins font-bold">
                      {currentView === 'login' && 'Consultar Resultados'}
                      {currentView === 'list' && 'Mis Resultados'}
                      {currentView === 'detail' && 'Detalle del Examen'}
                    </h2>
                    <p className="text-white/80 mt-1 text-sm sm:text-base">
                      {currentView === 'login' && 'Ingrese sus datos para acceder'}
                      {currentView === 'list' && `${filteredResults.length} exámenes encontrados`}
                      {currentView === 'detail' && selectedResult?.examType}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0">
              <AnimatePresence mode="wait">
                {/* Login View */}
                {currentView === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-md mx-auto"
                  >
                    {/* Security Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-1">
                            Acceso Seguro
                          </h3>
                          <p className="text-blue-700 text-sm">
                            Sus resultados están protegidos. Necesita el código de acceso 
                            que se le proporcionó al momento de realizar sus exámenes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Documento
                        </label>
                        <select
                          name="documentType"
                          value={loginData.documentType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                        >
                          <option value="CC">Cédula de Ciudadanía</option>
                          <option value="TI">Tarjeta de Identidad</option>
                          <option value="CE">Cédula de Extranjería</option>
                          <option value="PA">Pasaporte</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Documento
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="documentNumber"
                            value={loginData.documentNumber}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                            placeholder="1234567890"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Código de Acceso
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showAccessCode ? "text" : "password"}
                            name="accessCode"
                            value={loginData.accessCode}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                            placeholder="Ingrese su código"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAccessCode(!showAccessCode)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAccessCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            checked={loginData.rememberMe}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-biolab-turquoise border-gray-300 rounded focus:ring-biolab-turquoise"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Recordar mis datos
                          </span>
                        </label>
                        <a href="#" className="text-sm text-biolab-turquoise hover:text-biolab-blue">
                          ¿Olvidó su código?
                        </a>
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center px-6 py-3 bg-biolab-turquoise text-white rounded-lg font-medium hover:bg-biolab-blue transition-colors"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Consultar Resultados
                      </button>
                    </form>

                    {/* Help Section */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        ¿Necesita ayuda?
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-start">
                          <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          El código de acceso se encuentra en su comprobante de atención
                        </p>
                        <p className="flex items-start">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          Llámenos al: +57 318 123 4567
                        </p>
                        <p className="flex items-start">
                          <Mail className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          Escríbanos a: resultados@biolabsas.com
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Results List View */}
                {currentView === 'list' && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Patient Info */}
                    <div className="bg-gradient-to-r from-biolab-turquoise/10 to-biolab-blue/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Paciente</p>
                          <p className="font-semibold text-gray-800">Juan Pablo García López</p>
                          <p className="text-sm text-gray-600">CC: 1234567890</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="text-sm text-biolab-turquoise hover:text-biolab-blue"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Buscar examen..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFilterStatus('all')}
                          className={`px-4 py-3 rounded-lg font-medium transition-all ${
                            filterStatus === 'all'
                              ? 'bg-biolab-turquoise text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setFilterStatus('ready')}
                          className={`px-4 py-3 rounded-lg font-medium transition-all ${
                            filterStatus === 'ready'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Listos
                        </button>
                        <button
                          onClick={() => setFilterStatus('processing')}
                          className={`px-4 py-3 rounded-lg font-medium transition-all ${
                            filterStatus === 'processing'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          En proceso
                        </button>
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredResults.map((result) => (
                        <motion.div
                          key={result.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => result.status === 'ready' && handleViewResult(result)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                result.status === 'ready' ? 'bg-green-100' : 
                                result.status === 'processing' ? 'bg-yellow-100' : 'bg-gray-100'
                              }`}>
                                <result.icon className={`w-6 h-6 ${
                                  result.status === 'ready' ? 'text-green-600' : 
                                  result.status === 'processing' ? 'text-yellow-600' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="ml-3">
                                <h3 className="font-semibold text-gray-800">
                                  {result.examType}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(result.date).toLocaleDateString('es-CO', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(result.status)}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {result.time}
                            </p>
                            <p className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              {result.doctor}
                            </p>
                            <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {result.branch}
                            </p>
                          </div>

                          {result.status === 'ready' ? (
                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewResult(result)
                                }}
                                className="flex-1 flex items-center justify-center px-3 py-2 bg-biolab-turquoise text-white rounded-lg text-sm font-medium hover:bg-biolab-blue transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Lógica para descargar PDF
                                }}
                                className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Descargar
                              </button>
                            </div>
                          ) : result.status === 'processing' ? (
                            <div className="mt-4 p-2 bg-yellow-50 rounded-lg">
                              <p className="text-xs text-yellow-700">
                                Tiempo estimado: {result.estimatedTime}
                              </p>
                            </div>
                          ) : null}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Result Detail View */}
                {currentView === 'detail' && selectedResult && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Result Header */}
                    <div className="bg-gradient-to-r from-biolab-turquoise/10 to-biolab-blue/10 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                            <selectedResult.icon className="w-8 h-8 text-biolab-turquoise" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {selectedResult.examType}
                            </h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p>Fecha: {new Date(selectedResult.date).toLocaleDateString('es-CO')}</p>
                              <p>Médico: {selectedResult.doctor}</p>
                              <p>Sede: {selectedResult.branch}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
                            title="Descargar PDF"
                          >
                            <Download className="w-5 h-5 text-gray-700" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
                            title="Imprimir"
                          >
                            <Printer className="w-5 h-5 text-gray-700" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
                            title="Compartir"
                          >
                            <Share2 className="w-5 h-5 text-gray-700" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Result Details Table */}
                    {selectedResult.details && (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-800">
                            Resultados del Análisis
                          </h4>
                        </div>
                        <div className="p-6">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 text-sm font-semibold text-gray-700">
                                  Parámetro
                                </th>
                                <th className="text-center py-3 text-sm font-semibold text-gray-700">
                                  Resultado
                                </th>
                                <th className="text-center py-3 text-sm font-semibold text-gray-700">
                                  Valores de Referencia
                                </th>
                                <th className="text-center py-3 text-sm font-semibold text-gray-700">
                                  Estado
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(selectedResult.details).map(([key, data]) => (
                                <tr key={key} className="border-b border-gray-100">
                                  <td className="py-3 text-sm text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </td>
                                  <td className="py-3 text-sm text-center font-medium text-gray-800">
                                    {data.value} {data.unit}
                                  </td>
                                  <td className="py-3 text-sm text-center text-gray-600">
                                    {data.range}
                                  </td>
                                  <td className="py-3 text-center">
                                    {data.status === 'normal' ? (
                                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Normal
                                      </span>
                                    ) : data.status === 'warning' ? (
                                      <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Revisar
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                        <X className="w-3 h-3 mr-1" />
                                        Alterado
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 flex items-center justify-center px-4 py-3 bg-biolab-turquoise text-white rounded-lg font-medium hover:bg-biolab-blue transition-colors">
                        <Download className="w-5 h-5 mr-2" />
                        Descargar PDF Completo
                      </button>
                      <button className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Enviar por WhatsApp
                      </button>
                      <button className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        <Mail className="w-5 h-5 mr-2" />
                        Enviar por Email
                      </button>
                    </div>

                    {/* Medical Note */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-1">
                            Nota Importante
                          </h4>
                          <p className="text-yellow-700 text-sm">
                            Este resultado es un documento médico confidencial. Para su interpretación 
                            adecuada, consulte con su médico tratante. Si tiene dudas sobre los valores, 
                            puede contactar a nuestro equipo médico.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ResultsModal
