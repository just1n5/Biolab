import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Eye,
  FileText,
  Shield,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Building2,
  Activity,
  Stethoscope,
  Heart,
  Brain,
  Microscope,
  Syringe,
  Clock,
  Target,
  BarChart,
  BookOpen,
  Zap,
  Globe,
  Star,
  ArrowRight
} from "lucide-react";

// Secciones del portafolio
const portfolioSections = [
  {
    id: "intro",
    title: "BIOLAB S.A.S.",
    subtitle: "Salud Ocupacional",
    content: {
      title: "Tu Aliado Estratégico en SST",
      description: "Más de 21 años cuidando la salud de los trabajadores colombianos",
      highlights: [
        { icon: Award, text: "Certificación ISO 9001:2015", color: "text-yellow-600" },
        { icon: Users, text: "+500 empresas confían en nosotros", color: "text-blue-600" },
        { icon: Shield, text: "100% Cumplimiento normativo", color: "text-green-600" },
        { icon: Globe, text: "Cobertura nacional", color: "text-purple-600" }
      ],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
    }
  },
  {
    id: "services",
    title: "Nuestros Servicios",
    subtitle: "Soluciones integrales en SST",
    categories: [
      {
        name: "Exámenes Médicos Ocupacionales",
        icon: Stethoscope,
        color: "bg-blue-500",
        services: [
          "Exámenes de ingreso",
          "Exámenes periódicos",
          "Exámenes de retiro",
          "Exámenes post-incapacidad",
          "Cambio de ocupación"
        ]
      },
      {
        name: "Pruebas Complementarias",
        icon: Activity,
        color: "bg-green-500",
        services: [
          "Audiometría",
          "Optometría",
          "Espirometría",
          "Electrocardiograma",
          "Radiografías ocupacionales"
        ]
      },
      {
        name: "Laboratorio Clínico",
        icon: Microscope,
        color: "bg-purple-500",
        services: [
          "Hemograma completo",
          "Perfil lipídico",
          "Glicemia",
          "Pruebas de función hepática",
          "Pruebas de función renal"
        ]
      },
      {
        name: "Pruebas Especializadas",
        icon: Brain,
        color: "bg-orange-500",
        services: [
          "Pruebas psicotécnicas",
          "Evaluación para trabajo en alturas",
          "Espacios confinados",
          "Manejo de sustancias peligrosas",
          "Conducción de vehículos"
        ]
      },
      {
        name: "Vacunación Empresarial",
        icon: Syringe,
        color: "bg-red-500",
        services: [
          "Influenza estacional",
          "Hepatitis A y B",
          "Tétano y difteria",
          "Fiebre amarilla",
          "COVID-19"
        ]
      },
      {
        name: "Programas de Prevención",
        icon: Shield,
        color: "bg-teal-500",
        services: [
          "Riesgo cardiovascular",
          "Conservación visual",
          "Conservación auditiva",
          "Prevención de sustancias psicoactivas",
          "Riesgo psicosocial"
        ]
      }
    ]
  },
  {
    id: "benefits",
    title: "¿Por qué BIOLAB?",
    subtitle: "Ventajas competitivas",
    benefits: [
      {
        icon: Clock,
        title: "Resultados Rápidos",
        description: "Entrega de resultados en menos de 24 horas para la mayoría de exámenes"
      },
      {
        icon: Target,
        title: "Cobertura Total",
        description: "Servicio de toma de muestras en tu empresa con unidades móviles"
      },
      {
        icon: BarChart,
        title: "Reportes Inteligentes",
        description: "Dashboard personalizado con estadísticas y tendencias de salud"
      },
      {
        icon: Zap,
        title: "Tecnología Avanzada",
        description: "Equipos de última generación y procesos automatizados"
      },
      {
        icon: Heart,
        title: "Atención Humanizada",
        description: "Personal médico especializado con enfoque en el bienestar integral"
      },
      {
        icon: BookOpen,
        title: "Asesoría Continua",
        description: "Acompañamiento permanente en el cumplimiento del SG-SST"
      }
    ]
  },
  {
    id: "process",
    title: "Nuestro Proceso",
    subtitle: "Simple y eficiente",
    steps: [
      {
        number: "01",
        title: "Diagnóstico",
        description: "Evaluamos las necesidades específicas de tu empresa",
        icon: FileText
      },
      {
        number: "02",
        title: "Planificación",
        description: "Diseñamos un programa personalizado de SST",
        icon: Target
      },
      {
        number: "03",
        title: "Ejecución",
        description: "Implementamos los servicios acordados con profesionalismo",
        icon: Activity
      },
      {
        number: "04",
        title: "Seguimiento",
        description: "Monitoreamos y reportamos el estado de salud de tus trabajadores",
        icon: BarChart
      },
      {
        number: "05",
        title: "Mejora Continua",
        description: "Optimizamos los procesos basados en resultados y retroalimentación",
        icon: TrendingUp
      }
    ]
  },
  {
    id: "clients",
    title: "Casos de Éxito",
    subtitle: "Empresas que confían en nosotros",
    testimonials: [
      {
        company: "Constructora ABC",
        sector: "Construcción",
        employees: "500+",
        quote: "BIOLAB ha sido fundamental en la reducción de accidentalidad laboral en un 40%",
        results: ["40% menos accidentes", "100% cumplimiento legal", "Ahorro del 25% en costos"]
      },
      {
        company: "Logística XYZ",
        sector: "Transporte",
        employees: "300+",
        quote: "La eficiencia y profesionalismo de BIOLAB superó nuestras expectativas",
        results: ["Cero multas ARL", "95% satisfacción empleados", "Proceso 50% más rápido"]
      },
      {
        company: "Manufactura 123",
        sector: "Industrial",
        employees: "1000+",
        quote: "El servicio integral de BIOLAB simplificó toda nuestra gestión de SST",
        results: ["Certificación exitosa", "ROI del 300%", "Mejor clima laboral"]
      }
    ]
  }
];

const SstPortfolioModal = ({ isOpen, onClose }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleDownload = () => {
    // Aquí iría la lógica para descargar el PDF
    console.log("Descargando portafolio PDF...");
    alert("¡Portafolio descargado exitosamente!");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contacto enviado:", contactData);
    alert("¡Gracias por tu interés! Nos contactaremos pronto.");
    setShowContactForm(false);
  };

  const nextSection = () => {
    if (currentSection < portfolioSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (!isOpen) return null;

  const section = portfolioSections[currentSection];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] md:h-[85vh] max-h-[900px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-green-600 p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Portafolio SST</h2>
                    <p className="text-white/80 text-sm">
                      Soluciones integrales en Salud Ocupacional
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

              {/* Navigation dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {portfolioSections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSection(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSection
                        ? "w-8 bg-white"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              <AnimatePresence mode="wait">
                {/* Sección Intro */}
                {section.id === "intro" && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-8">
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                        >
                          {section.content.title}
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-xl text-gray-600"
                        >
                          {section.content.description}
                        </motion.p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {section.content.highlights.map((highlight, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 rounded-xl p-4 text-center"
                          >
                            <highlight.icon className={`w-8 h-8 mx-auto mb-2 ${highlight.color}`} />
                            <p className="text-sm font-medium text-gray-700">
                              {highlight.text}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative rounded-2xl overflow-hidden shadow-xl"
                      >
                        <img
                          src={section.content.image}
                          alt="BIOLAB SST"
                          className="w-full h-64 md:h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">
                              Comprometidos con la salud laboral
                            </h3>
                            <p className="text-white/90">
                              Tecnología, experiencia y calidad humana al servicio de tu empresa
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Sección Servicios */}
                {section.id === "services" && (
                  <motion.div
                    key="services"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="max-w-5xl mx-auto">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          {section.title}
                        </h2>
                        <p className="text-gray-600">
                          {section.subtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {section.categories.map((category, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                          >
                            <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                              <category.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-3">
                              {category.name}
                            </h3>
                            <ul className="space-y-1">
                              {category.services.map((service, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {service}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Sección Beneficios */}
                {section.id === "benefits" && (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="max-w-5xl mx-auto">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          {section.title}
                        </h2>
                        <p className="text-gray-600">
                          {section.subtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                          >
                            <div className="bg-gradient-to-br from-teal-50 to-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <benefit.icon className="w-8 h-8 text-teal-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                              {benefit.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {benefit.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl p-6 text-white text-center"
                      >
                        <Star className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                        <h3 className="text-xl font-bold mb-2">
                          Garantía de Calidad BIOLAB
                        </h3>
                        <p className="text-white/90 max-w-2xl mx-auto">
                          Todos nuestros procesos están certificados bajo ISO 9001:2015, 
                          garantizando los más altos estándares de calidad en cada servicio.
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Sección Proceso */}
                {section.id === "process" && (
                  <motion.div
                    key="process"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          {section.title}
                        </h2>
                        <p className="text-gray-600">
                          {section.subtitle}
                        </p>
                      </div>

                      <div className="space-y-6">
                        {section.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                {step.number}
                              </div>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-800 mb-1">
                                    {step.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {step.description}
                                  </p>
                                </div>
                                <step.icon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center"
                      >
                        <p className="text-gray-600 mb-4">
                          ¿Listo para optimizar la salud ocupacional de tu empresa?
                        </p>
                        <button
                          onClick={() => setShowContactForm(true)}
                          className="px-8 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                        >
                          Solicita una Demostración
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Sección Clientes */}
                {section.id === "clients" && (
                  <motion.div
                    key="clients"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="max-w-5xl mx-auto">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                          {section.title}
                        </h2>
                        <p className="text-gray-600">
                          {section.subtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {section.testimonials.map((testimonial, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-green-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-teal-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {testimonial.company}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {testimonial.sector} • {testimonial.employees} empleados
                                </p>
                              </div>
                            </div>

                            <p className="text-gray-600 italic mb-4">
                              "{testimonial.quote}"
                            </p>

                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Resultados:
                              </p>
                              {testimonial.results.map((result, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-600">{result}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer con acciones */}
            <div className="bg-gray-50 border-t p-4 md:p-6 flex items-center justify-between flex-shrink-0">
              <button
                onClick={prevSection}
                disabled={currentSection === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentSection === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Anterior</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden md:inline">Descargar PDF</span>
                </button>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Solicitar Cotización
                </button>
              </div>

              <button
                onClick={nextSection}
                disabled={currentSection === portfolioSections.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentSection === portfolioSections.length - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="hidden md:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Modal de contacto */}
            <AnimatePresence>
              {showContactForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl p-6 max-w-md w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Solicitar más información
                      </h3>
                      <button
                        onClick={() => setShowContactForm(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          required
                          value={contactData.name}
                          onChange={(e) => setContactData({...contactData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Empresa
                        </label>
                        <input
                          type="text"
                          required
                          value={contactData.company}
                          onChange={(e) => setContactData({...contactData, company: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={contactData.email}
                          onChange={(e) => setContactData({...contactData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactData.phone}
                          onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mensaje (opcional)
                        </label>
                        <textarea
                          rows="3"
                          value={contactData.message}
                          onChange={(e) => setContactData({...contactData, message: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowContactForm(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Enviar
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SstPortfolioModal;