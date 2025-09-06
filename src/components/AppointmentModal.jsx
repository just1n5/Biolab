import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Calendar, Clock, User, MapPin, Phone, Mail,
  ChevronRight, ChevronLeft, Check, AlertCircle,
  Search, Filter, FileText, TestTube, Heart,
  Activity, Droplet, Shield, Users, Baby,
  CreditCard, MessageCircle, Download, Printer
} from 'lucide-react'

const AppointmentModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    service: null,
    date: null,
    time: null,
    patientData: {
      firstName: '',
      lastName: '',
      documentType: 'CC',
      documentNumber: '',
      birthDate: '',
      gender: '',
      phone: '',
      email: '',
      address: ''
    },
    notes: ''
  })

  // Servicios disponibles
  const services = [
    {
      id: 1,
      category: 'Exámenes de Rutina',
      icon: TestTube,
      color: 'from-blue-500 to-blue-600',
      items: [
        { id: 'hem', name: 'Cuadro Hemático', price: 45000, preparation: 'No requiere ayuno' },
        { id: 'gli', name: 'Glicemia', price: 25000, preparation: 'Ayuno de 8 horas' },
        { id: 'lip', name: 'Perfil Lipídico', price: 85000, preparation: 'Ayuno de 12 horas' },
        { id: 'uri', name: 'Uroanálisis', price: 30000, preparation: 'Primera orina de la mañana' },
      ]
    },
    {
      id: 2,
      category: 'Salud Ocupacional',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      items: [
        { id: 'ing', name: 'Examen de Ingreso', price: 120000, preparation: 'Traer documento' },
        { id: 'per', name: 'Examen Periódico', price: 95000, preparation: 'No requiere preparación' },
        { id: 'ret', name: 'Examen de Retiro', price: 95000, preparation: 'No requiere preparación' },
        { id: 'alt', name: 'Trabajo en Alturas', price: 150000, preparation: 'Ayuno de 4 horas' },
      ]
    },
    {
      id: 3,
      category: 'Especialidades',
      icon: Heart,
      color: 'from-purple-500 to-purple-600',
      items: [
        { id: 'tir', name: 'Perfil Tiroideo', price: 120000, preparation: 'No requiere ayuno' },
        { id: 'emb', name: 'Prueba de Embarazo', price: 35000, preparation: 'No requiere preparación' },
        { id: 'psa', name: 'PSA (Próstata)', price: 75000, preparation: 'No requiere ayuno' },
        { id: 'vit', name: 'Vitamina D', price: 95000, preparation: 'No requiere ayuno' },
      ]
    }
  ]

  // Horarios disponibles (simulado)
  const timeSlots = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ]

  // Funciones para navegación del calendario
  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() - 1)
    setCurrentMonth(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + 1)
    setCurrentMonth(newMonth)
  }

  const canGoPrevMonth = () => {
    const today = new Date()
    today.setDate(1) // Comparar por mes, no por día
    const firstDayOfCurrentViewMonth = new Date(currentMonth)
    firstDayOfCurrentViewMonth.setDate(1)
    return firstDayOfCurrentViewMonth > today
  }

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Efecto para actualizar los días del calendario cuando cambia el mes
  useEffect(() => {
    const generateCalendarDaysForMonth = () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const days = []

      // Calcular el día de la semana del primer día del mes
      const firstDayOfWeek = firstDay.getDay()
      
      // Agregar días vacíos al inicio si el mes no empieza en domingo
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({
          day: '',
          date: null,
          available: false,
          isToday: false,
          isEmpty: true
        })
      }

      // Agregar los días del mes
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i)
        date.setHours(0, 0, 0, 0)
        const isSunday = date.getDay() === 0  // Solo domingo está deshabilitado
        const isPast = date < today
        days.push({
          day: i,
          date: date,
          available: !isSunday && !isPast,  // Sábados ahora están disponibles
          isToday: date.getTime() === today.getTime(),
          isEmpty: false
        })
      }
      return days
    }
    
    setCalendarDays(generateCalendarDaysForMonth())
  }, [currentMonth])

  const steps = [
    { number: 1, title: 'Servicio', icon: TestTube },
    { number: 2, title: 'Fecha y Hora', icon: Calendar },
    { number: 3, title: 'Datos Personales', icon: User },
    { number: 4, title: 'Confirmación', icon: Check }
  ]

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, service })
  }

  const handleDateSelect = (date) => {
    setFormData({ ...formData, date })
  }

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, time })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      patientData: {
        ...formData.patientData,
        [name]: value
      }
    })
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Aquí iría la lógica para enviar la cita
    console.log('Cita agendada:', formData)
    alert('¡Cita agendada exitosamente! Te enviaremos un correo de confirmación.')
    onClose()
  }

  // Filtrar servicios basado en búsqueda
  const filteredServices = services.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    !selectedCategory || category.id === selectedCategory
  )

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
            className="relative w-full max-w-6xl h-[85vh] sm:h-[90vh] max-h-[800px] bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed height */}
            <div className="flex-shrink-0 bg-gradient-to-r from-biolab-turquoise to-biolab-blue p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-poppins font-bold">Agendar Cita</h2>
                  <p className="text-white/80 mt-1 text-sm sm:text-base hidden sm:block">Complete los siguientes pasos para agendar su cita</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between overflow-x-auto">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                        ${currentStep >= step.number 
                          ? 'bg-white text-biolab-turquoise' 
                          : 'bg-white/20 text-white/60'}
                      `}>
                        {currentStep > step.number ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span className={`ml-3 hidden sm:block transition-all ${
                        currentStep >= step.number ? 'text-white' : 'text-white/60'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 transition-all ${
                        currentStep > step.number ? 'bg-white' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content - Scrollable area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0 scroll-smooth modal-content-scroll">
              <AnimatePresence mode="wait">
                {/* Step 1: Service Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Search and Filter */}
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
                        {services.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            className={`px-4 py-3 rounded-lg font-medium transition-all ${
                              selectedCategory === cat.id
                                ? 'bg-biolab-turquoise text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {cat.category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Services Grid */}
                    <div className="space-y-6">
                      {filteredServices.map((category) => (
                        category.items.length > 0 && (
                          <div key={category.id}>
                            <div className="flex items-center mb-4">
                              <category.icon className="w-6 h-6 text-biolab-turquoise mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                {category.category}
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {category.items.map((service) => (
                                <motion.div
                                  key={service.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleServiceSelect(service)}
                                  className={`
                                    p-4 rounded-xl border-2 cursor-pointer transition-all
                                    ${formData.service?.id === service.id
                                      ? 'border-biolab-turquoise bg-biolab-turquoise/5'
                                      : 'border-gray-200 hover:border-biolab-turquoise/50'}
                                  `}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800">{service.name}</h4>
                                    <span className="text-biolab-turquoise font-bold">
                                      ${service.price.toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    <AlertCircle className="w-4 h-4 inline mr-1" />
                                    {service.preparation}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Date and Time Selection */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      {/* Calendar */}
                      <div className="w-full">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3">
                          Selecciona una fecha
                        </h3>
                        {/* Leyenda */}
                        <div className="flex items-center gap-4 mb-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
                            <span className="text-gray-600">Disponible</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-100 rounded"></div>
                            <span className="text-gray-600">No disponible</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-biolab-turquoise/20 border-2 border-biolab-turquoise rounded"></div>
                            <span className="text-gray-600">Hoy</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                          {/* Navegación del mes */}
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={handlePrevMonth}
                              disabled={!canGoPrevMonth()}
                              className={`p-1.5 rounded-lg transition-all ${
                                canGoPrevMonth() 
                                  ? 'hover:bg-gray-200 text-gray-700' 
                                  : 'text-gray-300 cursor-not-allowed'
                              }`}
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h4 className="text-base font-semibold text-gray-800 capitalize">
                              {currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                            </h4>
                            <button
                              onClick={handleNextMonth}
                              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 transition-all"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                              <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {calendarDays.map((day, index) => (
                              day.isEmpty ? (
                                <div key={index} className="p-1.5 sm:p-2" />
                              ) : (
                                <motion.button
                                  key={index}
                                  whileHover={day.available ? { scale: 1.1 } : {}}
                                  whileTap={day.available ? { scale: 0.95 } : {}}
                                  onClick={() => day.available && handleDateSelect(day.date)}
                                  disabled={!day.available}
                                  className={`
                                    p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                                    ${!day.available 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : formData.date?.getDate() === day.day && formData.date?.getMonth() === day.date?.getMonth()
                                      ? 'bg-biolab-turquoise text-white shadow-lg'
                                      : day.isToday
                                      ? 'bg-biolab-turquoise/20 text-biolab-turquoise hover:bg-biolab-turquoise hover:text-white border-2 border-biolab-turquoise'
                                      : 'bg-white hover:bg-biolab-turquoise/10 hover:text-biolab-turquoise border border-gray-200'}
                                  `}
                                >
                                  {day.day}
                                </motion.button>
                              )
                            ))}
                          </div>
                        </div>
                        
                        {/* Mensaje informativo si no hay días disponibles */}
                        {calendarDays.filter(day => day.available).length === 0 && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                              No hay fechas disponibles en este mes. Los domingos y días pasados no están disponibles para agendar.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Time Slots */}
                      <div className="w-full">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3">
                          Selecciona un horario
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                          <div className="grid grid-cols-3 gap-2 max-h-[350px] overflow-y-auto pr-2">
                            {timeSlots.map((time) => (
                              <motion.button
                                key={time}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTimeSelect(time)}
                                className={`
                                  py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center
                                  ${formData.time === time
                                    ? 'bg-biolab-turquoise text-white'
                                    : 'bg-white hover:bg-gray-100'}
                                `}
                              >
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {time}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selected DateTime Summary */}
                    {formData.date && formData.time && (
                      <div className="bg-biolab-turquoise/10 rounded-xl p-4">
                        <p className="text-biolab-turquoise font-semibold">
                          Fecha y hora seleccionada:
                        </p>
                        <p className="text-gray-700 mt-1">
                          {formData.date.toLocaleDateString('es-CO', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} a las {formData.time}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Patient Data */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombres *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.patientData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                          placeholder="Juan Pablo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellidos *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.patientData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                          placeholder="García López"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Documento *
                        </label>
                        <select
                          name="documentType"
                          value={formData.patientData.documentType}
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
                          Número de Documento *
                        </label>
                        <input
                          type="text"
                          name="documentNumber"
                          value={formData.patientData.documentNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                          placeholder="1234567890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Nacimiento *
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.patientData.birthDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Género *
                        </label>
                        <select
                          name="gender"
                          value={formData.patientData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                        >
                          <option value="">Seleccionar</option>
                          <option value="M">Masculino</option>
                          <option value="F">Femenino</option>
                          <option value="O">Otro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.patientData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                          placeholder="300 123 4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.patientData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.patientData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent"
                          placeholder="Calle 123 #45-67, Barrio"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observaciones o comentarios
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent resize-none"
                          placeholder="Alguna información adicional que debamos conocer..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <Check className="w-6 h-6 text-green-600 mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold text-green-800">
                            ¡Tu cita está casi lista!
                          </h3>
                          <p className="text-green-600 text-sm mt-1">
                            Revisa los detalles y confirma tu cita
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Resumen de tu cita
                      </h3>

                      {/* Service */}
                      <div className="flex items-start">
                        <TestTube className="w-5 h-5 text-biolab-turquoise mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Examen</p>
                          <p className="font-semibold text-gray-800">{formData.service?.name}</p>
                          <p className="text-biolab-turquoise font-bold">
                            ${formData.service?.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-biolab-turquoise mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Fecha y hora</p>
                          <p className="font-semibold text-gray-800">
                            {formData.date?.toLocaleDateString('es-CO', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-gray-700">{formData.time}</p>
                        </div>
                      </div>

                      {/* Patient */}
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-biolab-turquoise mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Paciente</p>
                          <p className="font-semibold text-gray-800">
                            {formData.patientData.firstName} {formData.patientData.lastName}
                          </p>
                          <p className="text-gray-700">
                            {formData.patientData.documentType}: {formData.patientData.documentNumber}
                          </p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-biolab-turquoise mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Contacto</p>
                          <p className="font-semibold text-gray-800">{formData.patientData.phone}</p>
                          <p className="text-gray-700">{formData.patientData.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Preparation Instructions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">
                            Preparación para el examen
                          </h4>
                          <p className="text-yellow-700 text-sm mt-1">
                            {formData.service?.preparation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Download className="w-5 h-5 mr-2" />
                        Descargar confirmación
                      </button>
                      <button className="flex-1 flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Enviar por WhatsApp
                      </button>
                      <button className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Printer className="w-5 h-5 mr-2" />
                        Imprimir
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Navigation - Always visible */}
            <div className="flex-shrink-0 border-t bg-gray-50 p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`
                    flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base
                    ${currentStep === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Anterior</span>
                  <span className="sm:hidden">Atrás</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 1 && !formData.service) ||
                      (currentStep === 2 && (!formData.date || !formData.time)) ||
                      (currentStep === 3 && !formData.patientData.firstName)
                    }
                    className={`
                      flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base
                      ${((currentStep === 1 && !formData.service) ||
                         (currentStep === 2 && (!formData.date || !formData.time)) ||
                         (currentStep === 3 && !formData.patientData.firstName))
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-biolab-turquoise text-white hover:bg-biolab-blue'}
                    `}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center px-4 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    Confirmar Cita
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AppointmentModal
