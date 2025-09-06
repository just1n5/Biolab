import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Shield,
  FileText,
  Stethoscope,
  Eye,
  Ear,
  Activity,
  Brain,
  Syringe,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Package,
  Send,
  Download,
  Calculator,
  Star,
  TrendingUp
} from "lucide-react";

// Servicios SST disponibles
const sstServices = [
  {
    id: "examenes-medicos",
    name: "Exámenes Médicos Ocupacionales",
    icon: Stethoscope,
    category: "Evaluaciones Médicas",
    description: "Evaluaciones médicas completas para trabajadores",
    options: [
      { id: "ingreso", name: "Exámenes de Ingreso", price: 85000 },
      { id: "periodico", name: "Exámenes Periódicos", price: 75000 },
      { id: "retiro", name: "Exámenes de Retiro", price: 85000 },
      { id: "reintegro", name: "Exámenes de Reintegro", price: 90000 },
      { id: "cambio-ocupacion", name: "Cambio de Ocupación", price: 85000 }
    ]
  },
  {
    id: "examenes-complementarios",
    name: "Exámenes Complementarios",
    icon: Activity,
    category: "Pruebas Especializadas",
    description: "Pruebas específicas según riesgo laboral",
    options: [
      { id: "audiometria", name: "Audiometría", price: 45000 },
      { id: "optometria", name: "Optometría", price: 40000 },
      { id: "espirometria", name: "Espirometría", price: 55000 },
      { id: "visiometria", name: "Visiometría", price: 35000 },
      { id: "electrocardiograma", name: "Electrocardiograma", price: 60000 }
    ]
  },
  {
    id: "laboratorio-clinico",
    name: "Laboratorio Clínico",
    icon: FileText,
    category: "Análisis Clínicos",
    description: "Análisis de laboratorio especializados",
    options: [
      { id: "hemograma", name: "Hemograma Completo", price: 35000 },
      { id: "glicemia", name: "Glicemia", price: 20000 },
      { id: "perfil-lipidico", name: "Perfil Lipídico", price: 65000 },
      { id: "parcial-orina", name: "Parcial de Orina", price: 25000 },
      { id: "colinesterasa", name: "Colinesterasa", price: 45000 }
    ]
  },
  {
    id: "pruebas-psicotecnicas",
    name: "Pruebas Psicotécnicas",
    icon: Brain,
    category: "Evaluación Psicológica",
    description: "Evaluación de aptitudes y competencias",
    options: [
      { id: "conductores", name: "Para Conductores", price: 120000 },
      { id: "alturas", name: "Trabajo en Alturas", price: 100000 },
      { id: "espacios-confinados", name: "Espacios Confinados", price: 100000 },
      { id: "manejo-sustancias", name: "Manejo de Sustancias Peligrosas", price: 110000 }
    ]
  },
  {
    id: "vacunacion",
    name: "Vacunación Corporativa",
    icon: Syringe,
    category: "Inmunización",
    description: "Programas de vacunación empresarial",
    options: [
      { id: "influenza", name: "Influenza", price: 35000 },
      { id: "hepatitis-b", name: "Hepatitis B (esquema)", price: 150000 },
      { id: "tetano", name: "Tétano", price: 30000 },
      { id: "fiebre-amarilla", name: "Fiebre Amarilla", price: 80000 },
      { id: "covid19", name: "COVID-19", price: 45000 }
    ]
  },
  {
    id: "programas-prevencion",
    name: "Programas de Prevención",
    icon: Shield,
    category: "Salud Preventiva",
    description: "Programas integrales de salud",
    options: [
      { id: "riesgo-cardiovascular", name: "Riesgo Cardiovascular", price: 180000 },
      { id: "spa", name: "SPA (Sustancias Psicoactivas)", price: 95000 },
      { id: "conservacion-visual", name: "Conservación Visual", price: 150000 },
      { id: "conservacion-auditiva", name: "Conservación Auditiva", price: 150000 },
      { id: "riesgo-psicosocial", name: "Riesgo Psicosocial", price: 200000 }
    ]
  }
];

// Sectores económicos
const economicSectors = [
  "Agricultura y Ganadería",
  "Construcción",
  "Manufactura",
  "Comercio",
  "Servicios",
  "Salud",
  "Educación",
  "Tecnología",
  "Transporte y Logística",
  "Minería y Energía",
  "Hotelería y Turismo",
  "Financiero",
  "Gobierno",
  "Otro"
];

const SstQuoteModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Información de la empresa
    company: {
      name: "",
      nit: "",
      sector: "",
      city: "",
      address: "",
      employeeCount: "",
      riskLevel: ""
    },
    // Paso 2: Servicios seleccionados
    selectedServices: {},
    // Paso 3: Detalles adicionales
    details: {
      frequency: "anual",
      startDate: "",
      locations: 1,
      requiresMobile: false,
      additionalNotes: ""
    },
    // Paso 4: Contacto
    contact: {
      name: "",
      position: "",
      email: "",
      phone: "",
      preferredContact: "email"
    }
  });

  const totalSteps = 4;

  // Calcular precio estimado
  const calculateEstimatedPrice = () => {
    let total = 0;
    Object.values(formData.selectedServices).forEach(serviceOptions => {
      serviceOptions.forEach(option => {
        const service = sstServices.find(s => 
          s.options.some(o => o.id === option)
        );
        if (service) {
          const selectedOption = service.options.find(o => o.id === option);
          if (selectedOption) {
            total += selectedOption.price * (parseInt(formData.company.employeeCount) || 0);
          }
        }
      });
    });
    
    // Aplicar descuentos por volumen
    const employees = parseInt(formData.company.employeeCount) || 0;
    if (employees >= 100) total *= 0.85; // 15% descuento
    else if (employees >= 50) total *= 0.90; // 10% descuento
    else if (employees >= 20) total *= 0.95; // 5% descuento
    
    return total;
  };

  const handleServiceToggle = (serviceId, optionId) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: {
        ...prev.selectedServices,
        [serviceId]: prev.selectedServices[serviceId]?.includes(optionId)
          ? prev.selectedServices[serviceId].filter(id => id !== optionId)
          : [...(prev.selectedServices[serviceId] || []), optionId]
      }
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.company.name && 
               formData.company.nit && 
               formData.company.sector && 
               formData.company.employeeCount;
      case 2:
        return Object.values(formData.selectedServices).some(s => s.length > 0);
      case 3:
        return formData.details.startDate;
      case 4:
        return formData.contact.name && 
               formData.contact.email && 
               formData.contact.phone;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Cotización enviada:", formData);
    // Aquí iría la lógica para enviar la cotización
    alert("¡Cotización enviada exitosamente! Nos contactaremos pronto.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] md:h-[85vh] max-h-[800px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Solicitar Cotización SST</h2>
                    <p className="text-white/80 text-sm">
                      Paso {currentStep} de {totalSteps}
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

              {/* Progress bar */}
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white rounded-full h-2"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              <AnimatePresence mode="wait">
                {/* Paso 1: Información de la empresa */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Información de la Empresa
                      </h3>
                      <p className="text-gray-600">
                        Cuéntanos sobre tu empresa para personalizar la cotización
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Building2 className="w-4 h-4 inline mr-1" />
                          Nombre de la empresa *
                        </label>
                        <input
                          type="text"
                          value={formData.company.name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            company: { ...prev.company, name: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="BIOLAB S.A.S."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NIT *
                        </label>
                        <input
                          type="text"
                          value={formData.company.nit}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            company: { ...prev.company, nit: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="900.123.456-7"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Briefcase className="w-4 h-4 inline mr-1" />
                          Sector económico *
                        </label>
                        <select
                          value={formData.company.sector}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            company: { ...prev.company, sector: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar sector</option>
                          {economicSectors.map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Users className="w-4 h-4 inline mr-1" />
                          Número de empleados *
                        </label>
                        <input
                          type="number"
                          value={formData.company.employeeCount}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            company: { ...prev.company, employeeCount: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Ciudad
                        </label>
                        <input
                          type="text"
                          value={formData.company.city}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            company: { ...prev.company, city: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Bogotá"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Shield className="w-4 h-4 inline mr-1" />
                          Nivel de riesgo ARL
                        </label>
                        <select
                          value={formData.company.riskLevel}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            company: { ...prev.company, riskLevel: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar nivel</option>
                          <option value="I">Nivel I (Riesgo Mínimo)</option>
                          <option value="II">Nivel II (Riesgo Bajo)</option>
                          <option value="III">Nivel III (Riesgo Medio)</option>
                          <option value="IV">Nivel IV (Riesgo Alto)</option>
                          <option value="V">Nivel V (Riesgo Máximo)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección
                        </label>
                        <input
                          type="text"
                          value={formData.company.address}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            company: { ...prev.company, address: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Calle 123 #45-67"
                        />
                      </div>
                    </div>

                    {/* Beneficios por volumen */}
                    {formData.company.employeeCount && parseInt(formData.company.employeeCount) >= 20 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">
                            ¡Descuento por volumen aplicable!
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          {parseInt(formData.company.employeeCount) >= 100 && "15% de descuento para más de 100 empleados"}
                          {parseInt(formData.company.employeeCount) >= 50 && parseInt(formData.company.employeeCount) < 100 && "10% de descuento para 50-99 empleados"}
                          {parseInt(formData.company.employeeCount) >= 20 && parseInt(formData.company.employeeCount) < 50 && "5% de descuento para 20-49 empleados"}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Paso 2: Selección de servicios */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Servicios SST Requeridos
                      </h3>
                      <p className="text-gray-600">
                        Selecciona los servicios que necesita tu empresa
                      </p>
                    </div>

                    <div className="space-y-6">
                      {sstServices.map((service) => (
                        <div key={service.id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <service.icon className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">
                                {service.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {service.description}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-10">
                            {service.options.map((option) => (
                              <label
                                key={option.id}
                                className="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.selectedServices[service.id]?.includes(option.id) || false}
                                  onChange={() => handleServiceToggle(service.id, option.id)}
                                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700 flex-1">
                                  {option.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ${option.price.toLocaleString('es-CO')}/persona
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Precio estimado */}
                    {Object.values(formData.selectedServices).some(s => s.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-800">
                              Precio estimado:
                            </span>
                          </div>
                          <span className="text-xl font-bold text-blue-800">
                            ${calculateEstimatedPrice().toLocaleString('es-CO')} COP
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          * Precio estimado basado en {formData.company.employeeCount || 0} empleados
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Paso 3: Detalles adicionales */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Detalles del Servicio
                      </h3>
                      <p className="text-gray-600">
                        Información adicional para personalizar tu cotización
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Frecuencia del servicio
                        </label>
                        <select
                          value={formData.details.frequency}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            details: { ...prev.details, frequency: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="unica">Única vez</option>
                          <option value="mensual">Mensual</option>
                          <option value="trimestral">Trimestral</option>
                          <option value="semestral">Semestral</option>
                          <option value="anual">Anual</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Fecha estimada de inicio *
                        </label>
                        <input
                          type="date"
                          value={formData.details.startDate}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            details: { ...prev.details, startDate: e.target.value }
                          }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Número de sedes o ubicaciones
                        </label>
                        <input
                          type="number"
                          value={formData.details.locations}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            details: { ...prev.details, locations: parseInt(e.target.value) }
                          }))}
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.details.requiresMobile}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              details: { ...prev.details, requiresMobile: e.target.checked }
                            }))}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">
                            Requiere unidad móvil para toma de muestras en sitio
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observaciones adicionales
                        </label>
                        <textarea
                          value={formData.details.additionalNotes}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            details: { ...prev.details, additionalNotes: e.target.value }
                          }))}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Información adicional que consideres relevante para tu cotización..."
                        />
                      </div>
                    </div>

                    {/* Beneficios */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <Star className="w-6 h-6 text-green-600 mb-2" />
                        <h5 className="font-medium text-gray-800 mb-1">
                          Atención Prioritaria
                        </h5>
                        <p className="text-xs text-gray-600">
                          Respuesta en menos de 24 horas
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <Shield className="w-6 h-6 text-blue-600 mb-2" />
                        <h5 className="font-medium text-gray-800 mb-1">
                          Cumplimiento Normativo
                        </h5>
                        <p className="text-xs text-gray-600">
                          100% alineado con la legislación
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                        <h5 className="font-medium text-gray-800 mb-1">
                          Reportes Detallados
                        </h5>
                        <p className="text-xs text-gray-600">
                          Dashboard y análisis completo
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Paso 4: Información de contacto */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Información de Contacto
                      </h3>
                      <p className="text-gray-600">
                        ¿Con quién nos comunicamos para enviar la cotización?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Users className="w-4 h-4 inline mr-1" />
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value={formData.contact.name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contact: { ...prev.contact, name: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Juan Pérez"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Briefcase className="w-4 h-4 inline mr-1" />
                          Cargo
                        </label>
                        <input
                          type="text"
                          value={formData.contact.position}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contact: { ...prev.contact, position: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Jefe de Recursos Humanos"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Correo electrónico *
                        </label>
                        <input
                          type="email"
                          value={formData.contact.email}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contact: { ...prev.contact, email: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="juan.perez@empresa.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={formData.contact.phone}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contact: { ...prev.contact, phone: e.target.value }
                          }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="300 123 4567"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medio de contacto preferido
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="email"
                              checked={formData.contact.preferredContact === "email"}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                contact: { ...prev.contact, preferredContact: e.target.value }
                              }))}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">Correo electrónico</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="phone"
                              checked={formData.contact.preferredContact === "phone"}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                contact: { ...prev.contact, preferredContact: e.target.value }
                              }))}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">Teléfono</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="whatsapp"
                              checked={formData.contact.preferredContact === "whatsapp"}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                contact: { ...prev.contact, preferredContact: e.target.value }
                              }))}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">WhatsApp</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Resumen de la cotización */}
                    <div className="mt-6 bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Resumen de tu cotización
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Empresa:</span>
                          <span className="font-medium">{formData.company.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Empleados:</span>
                          <span className="font-medium">{formData.company.employeeCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Servicios seleccionados:</span>
                          <span className="font-medium">
                            {Object.values(formData.selectedServices).reduce((acc, curr) => acc + curr.length, 0)} servicios
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frecuencia:</span>
                          <span className="font-medium capitalize">{formData.details.frequency}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                          <span className="font-medium text-gray-700">Precio estimado:</span>
                          <span className="text-lg font-bold text-green-600">
                            ${calculateEstimatedPrice().toLocaleString('es-CO')} COP
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <p className="text-xs text-yellow-800">
                            Esta es una cotización estimada. El precio final puede variar según 
                            los requerimientos específicos. Un asesor se comunicará contigo en 
                            las próximas 24 horas hábiles.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer con botones */}
            <div className="bg-gray-50 border-t p-4 md:p-6 flex items-center justify-between flex-shrink-0">
              <button
                onClick={currentStep === 1 ? onClose : handleBack}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {currentStep === 1 ? "Cancelar" : "Anterior"}
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index < currentStep
                        ? "bg-green-600"
                        : index === currentStep - 1
                        ? "bg-green-400"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={currentStep === totalSteps ? handleSubmit : handleNext}
                disabled={!isStepValid()}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isStepValid()
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentStep === totalSteps ? (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Cotización
                  </>
                ) : (
                  <>
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SstQuoteModal;