import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  Calendar,
  Package,
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  AlertCircle,
  Clock,
  Shield,
  Heart,
  Eye,
  Ear,
  Activity,
  Brain,
  Syringe,
  Calculator,
  Send,
  Download,
  Briefcase,
  Target,
  TrendingUp,
  Award
} from "lucide-react";

const QuotationModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Información de la empresa
    companyName: "",
    nit: "",
    industry: "",
    employeeCount: "",
    locations: "",
    
    // Servicios seleccionados
    services: [],
    
    // Detalles del programa
    frequency: "",
    startDate: "",
    coverage: "",
    additionalRequirements: "",
    
    // Información de contacto
    contactName: "",
    position: "",
    email: "",
    phone: "",
    preferredContact: "email"
  });

  const industries = [
    "Construcción",
    "Manufactura",
    "Servicios",
    "Salud",
    "Educación",
    "Tecnología",
    "Comercio",
    "Transporte",
    "Alimentos",
    "Minería",
    "Agricultura",
    "Otro"
  ];

  const sstServices = [
    {
      id: "ingreso",
      name: "Exámenes de Ingreso",
      icon: Users,
      description: "Evaluación médica completa para nuevos empleados",
      includes: ["Historia clínica", "Examen físico", "Laboratorios básicos"],
      popular: true
    },
    {
      id: "periodicos",
      name: "Exámenes Periódicos",
      icon: Calendar,
      description: "Seguimiento anual de la salud de los trabajadores",
      includes: ["Chequeo general", "Exámenes específicos por riesgo"],
      popular: true
    },
    {
      id: "retiro",
      name: "Exámenes de Retiro",
      icon: FileText,
      description: "Evaluación al finalizar la relación laboral",
      includes: ["Examen de egreso", "Certificación de estado de salud"]
    },
    {
      id: "audiometria",
      name: "Audiometría",
      icon: Ear,
      description: "Evaluación de capacidad auditiva",
      includes: ["Audiometría tonal", "Audiometría vocal"],
      required: ["Exposición a ruido > 85 dB"]
    },
    {
      id: "optometria",
      name: "Optometría",
      icon: Eye,
      description: "Evaluación completa de agudeza visual",
      includes: ["Agudeza visual", "Campimetría", "Test de colores"],
      required: ["Trabajo en alturas", "Conducción"]
    },
    {
      id: "espirometria",
      name: "Espirometría",
      icon: Activity,
      description: "Evaluación de función pulmonar",
      includes: ["Capacidad vital", "Flujos respiratorios"],
      required: ["Exposición a polvos", "Químicos"]
    },
    {
      id: "psicotecnicas",
      name: "Pruebas Psicotécnicas",
      icon: Brain,
      description: "Evaluación de aptitudes y competencias",
      includes: ["Test psicológicos", "Evaluación de competencias"],
      popular: true
    },
    {
      id: "vacunacion",
      name: "Vacunación Corporativa",
      icon: Syringe,
      description: "Programas de inmunización empresarial",
      includes: ["Influenza", "Hepatitis B", "Tétanos", "COVID-19"]
    },
    {
      id: "laboratorios",
      name: "Laboratorios Especializados",
      icon: Shield,
      description: "Exámenes según exposición a riesgos",
      includes: ["Toxicología", "Biomarcadores", "Metales pesados"]
    }
  ];

  const frequencies = [
    { value: "mensual", label: "Mensual", description: "Visitas cada mes" },
    { value: "bimestral", label: "Bimestral", description: "Cada 2 meses" },
    { value: "trimestral", label: "Trimestral", description: "Cada 3 meses" },
    { value: "semestral", label: "Semestral", description: "2 veces al año" },
    { value: "anual", label: "Anual", description: "Una vez al año" },
    { value: "demanda", label: "Por demanda", description: "Según necesidad" }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleServiceToggle = (serviceId) => {
    if (formData.services.includes(serviceId)) {
      setFormData({
        ...formData,
        services: formData.services.filter(id => id !== serviceId)
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, serviceId]
      });
    }
  };

  const handleSubmit = () => {
    console.log("Enviando cotización:", formData);
    alert("¡Cotización enviada! Nos contactaremos en las próximas 24 horas.");
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.nit && formData.industry && formData.employeeCount;
      case 2:
        return formData.services.length > 0;
      case 3:
        return formData.frequency && formData.startDate;
      case 4:
        return formData.contactName && formData.email && formData.phone;
      default:
        return false;
    }
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
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 md:p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      Cotización Salud Ocupacional
                    </h2>
                    <p className="text-green-100 text-sm">
                      Soluciones integrales para su empresa
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

              {/* Progress Steps */}
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all ${
                        currentStep >= step
                          ? "bg-white text-green-600"
                          : "bg-white/20 text-white/60"
                      }`}
                    >
                      {currentStep > step ? <Check className="w-5 h-5" /> : step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-12 md:w-24 h-1 mx-2 rounded transition-all ${
                          currentStep > step ? "bg-white" : "bg-white/20"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Company Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Información de la Empresa
                        </h3>
                        <p className="text-gray-600">
                          Cuéntenos sobre su organización para crear una propuesta personalizada
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la Empresa *
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.companyName}
                              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Empresa S.A.S"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            NIT *
                          </label>
                          <input
                            type="text"
                            value={formData.nit}
                            onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="900.123.456-7"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sector Industrial *
                          </label>
                          <select
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="">Seleccione un sector</option>
                            {industries.map(industry => (
                              <option key={industry} value={industry}>{industry}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Empleados *
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                              value={formData.employeeCount}
                              onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="">Seleccione un rango</option>
                              <option value="1-10">1-10 empleados</option>
                              <option value="11-50">11-50 empleados</option>
                              <option value="51-100">51-100 empleados</option>
                              <option value="101-500">101-500 empleados</option>
                              <option value="500+">Más de 500 empleados</option>
                            </select>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ubicaciones/Sedes
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                              value={formData.locations}
                              onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={3}
                              placeholder="Ej: Sede principal en Bogotá, Planta en Medellín..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Beneficios */}
                      <div className="bg-green-50 rounded-xl p-6 mt-6">
                        <h4 className="font-semibold text-green-800 mb-3">
                          Beneficios de nuestro programa SST
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            "Cumplimiento normativo garantizado",
                            "Reducción de ausentismo laboral",
                            "Mejora del clima organizacional",
                            "Prevención de enfermedades laborales",
                            "Asesoría especializada continua",
                            "Reportes y estadísticas mensuales"
                          ].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Service Selection */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Servicios Requeridos
                        </h3>
                        <p className="text-gray-600">
                          Seleccione los servicios que necesita para su programa de salud ocupacional
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sstServices.map((service) => {
                          const Icon = service.icon;
                          const isSelected = formData.services.includes(service.id);
                          
                          return (
                            <motion.div
                              key={service.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <button
                                onClick={() => handleServiceToggle(service.id)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                  isSelected
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                      isSelected ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
                                    }`}>
                                      <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-800">
                                        {service.name}
                                      </h4>
                                      {service.popular && (
                                        <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full mt-1">
                                          Popular
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected
                                      ? "border-green-500 bg-green-500"
                                      : "border-gray-300"
                                  }`}>
                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-2">
                                  {service.description}
                                </p>
                                
                                {service.includes && (
                                  <div className="space-y-1">
                                    {service.includes.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                        <span className="text-xs text-gray-500">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {service.required && (
                                  <div className="mt-2 p-2 bg-amber-50 rounded-lg">
                                    <p className="text-xs text-amber-700">
                                      <strong>Requerido para:</strong> {service.required.join(", ")}
                                    </p>
                                  </div>
                                )}
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>

                      {formData.services.length > 0 && (
                        <div className="bg-green-50 rounded-xl p-4">
                          <p className="text-sm text-green-800">
                            <strong>{formData.services.length} servicio(s) seleccionado(s)</strong>
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Program Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Detalles del Programa
                        </h3>
                        <p className="text-gray-600">
                          Configure la frecuencia y alcance de los servicios
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* Frecuencia */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Frecuencia de Servicios *
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {frequencies.map((freq) => (
                              <button
                                key={freq.value}
                                onClick={() => setFormData({ ...formData, frequency: freq.value })}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  formData.frequency === freq.value
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <p className="font-medium text-gray-800">{freq.label}</p>
                                <p className="text-xs text-gray-500 mt-1">{freq.description}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Fecha de inicio */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fecha de Inicio Deseada *
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cobertura
                            </label>
                            <select
                              value={formData.coverage}
                              onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="">Seleccione cobertura</option>
                              <option value="local">Solo sede principal</option>
                              <option value="regional">Todas las sedes regionales</option>
                              <option value="nacional">Cobertura nacional</option>
                            </select>
                          </div>
                        </div>

                        {/* Requerimientos adicionales */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Requerimientos Adicionales
                          </label>
                          <textarea
                            value={formData.additionalRequirements}
                            onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows={4}
                            placeholder="Describa cualquier necesidad específica, horarios especiales, certificaciones requeridas, etc."
                          />
                        </div>

                        {/* Resumen de servicios seleccionados */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Resumen de Servicios Seleccionados
                          </h4>
                          <div className="space-y-2">
                            {formData.services.map(serviceId => {
                              const service = sstServices.find(s => s.id === serviceId);
                              if (!service) return null;
                              const Icon = service.icon;
                              return (
                                <div key={serviceId} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                  <Icon className="w-5 h-5 text-green-600" />
                                  <span className="text-sm text-gray-700">{service.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Contact Information */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Información de Contacto
                        </h3>
                        <p className="text-gray-600">
                          ¿Con quién debemos comunicarnos para dar seguimiento?
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre Completo *
                          </label>
                          <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Juan Pérez"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cargo
                          </label>
                          <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Jefe de Recursos Humanos"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Corporativo *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="contacto@empresa.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono de Contacto *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="(601) 123 4567"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Medio de Contacto Preferido
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value="email"
                                checked={formData.preferredContact === "email"}
                                onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Email</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value="phone"
                                checked={formData.preferredContact === "phone"}
                                onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Teléfono</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value="whatsapp"
                                checked={formData.preferredContact === "whatsapp"}
                                onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">WhatsApp</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Resumen final */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Resumen de su Solicitud
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Building2 className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Empresa</p>
                              <p className="text-sm text-gray-600">
                                {formData.companyName} - {formData.industry}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Empleados</p>
                              <p className="text-sm text-gray-600">{formData.employeeCount}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Package className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Servicios</p>
                              <p className="text-sm text-gray-600">
                                {formData.services.length} servicios seleccionados
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Inicio</p>
                              <p className="text-sm text-gray-600">
                                {formData.startDate ? new Date(formData.startDate).toLocaleDateString('es-CO') : 'Por definir'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <Clock className="w-5 h-5" />
                            <p className="text-sm font-medium">
                              Tiempo de respuesta: 24 horas hábiles
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between flex-shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">Anterior</span>
                <span className="md:hidden">Atrás</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Paso {currentStep} de 4
                </span>
              </div>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                    isStepValid()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                    isStepValid()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Cotización
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuotationModal;