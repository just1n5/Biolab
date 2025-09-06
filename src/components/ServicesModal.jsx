import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Filter,
  Clock,
  AlertCircle,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  Baby,
  Users,
  Stethoscope,
  Activity,
  Droplet,
  Shield,
  Microscope,
  Dna,
  TestTube,
  Pill,
  Zap,
  Brain,
  Eye,
  Bone,
  HeartPulse,
  Info,
  Download,
  Share2,
  ShoppingCart,
  Check,
  TrendingUp
} from "lucide-react";

// Categorías de servicios
const categories = [
  {
    id: "rutina",
    name: "Exámenes de Rutina",
    icon: Stethoscope,
    color: "bg-blue-500",
    description: "Chequeos básicos y preventivos"
  },
  {
    id: "especialidad",
    name: "Especialidades",
    icon: Microscope,
    color: "bg-purple-500",
    description: "Análisis especializados"
  },
  {
    id: "pediatrico",
    name: "Pediátricos",
    icon: Baby,
    color: "bg-pink-500",
    description: "Exámenes para niños"
  },
  {
    id: "mujer",
    name: "Salud de la Mujer",
    icon: Heart,
    color: "bg-rose-500",
    description: "Exámenes ginecológicos y hormonales"
  },
  {
    id: "ocupacional",
    name: "Salud Ocupacional",
    icon: Shield,
    color: "bg-green-500",
    description: "Exámenes laborales"
  },
  {
    id: "covid",
    name: "COVID-19",
    icon: Activity,
    color: "bg-red-500",
    description: "Pruebas de detección"
  }
];

// Base de datos de servicios ampliada
const servicesDatabase = [
  // Rutina
  {
    id: 1,
    category: "rutina",
    name: "Hemograma Completo",
    description: "Análisis completo de células sanguíneas",
    price: 45000,
    timeDelivery: "4 horas",
    preparation: "Ayuno de 8 horas",
    sample: "Sangre venosa",
    popular: true,
    tags: ["Básico", "Preventivo"],
    details: {
      includes: ["Glóbulos rojos", "Glóbulos blancos", "Plaquetas", "Hemoglobina", "Hematocrito"],
      purpose: "Detectar anemia, infecciones y problemas de coagulación",
      frequency: "Anual o según indicación médica"
    }
  },
  {
    id: 2,
    category: "rutina",
    name: "Glicemia",
    description: "Medición de glucosa en sangre",
    price: 20000,
    timeDelivery: "2 horas",
    preparation: "Ayuno de 8-12 horas",
    sample: "Sangre venosa",
    popular: true,
    tags: ["Diabetes", "Control"],
    details: {
      includes: ["Glucosa en ayunas"],
      purpose: "Diagnóstico y control de diabetes",
      frequency: "Trimestral para diabéticos"
    }
  },
  {
    id: 3,
    category: "rutina",
    name: "Perfil Lipídico",
    description: "Análisis de colesterol y triglicéridos",
    price: 65000,
    timeDelivery: "6 horas",
    preparation: "Ayuno de 12 horas",
    sample: "Sangre venosa",
    popular: true,
    tags: ["Cardiovascular", "Preventivo"],
    details: {
      includes: ["Colesterol total", "HDL", "LDL", "VLDL", "Triglicéridos"],
      purpose: "Evaluar riesgo cardiovascular",
      frequency: "Anual o semestral"
    }
  },
  {
    id: 4,
    category: "rutina",
    name: "Creatinina",
    description: "Evaluación de función renal",
    price: 25000,
    timeDelivery: "4 horas",
    preparation: "No requiere",
    sample: "Sangre venosa",
    tags: ["Riñón", "Control"],
    details: {
      includes: ["Creatinina sérica", "TFG estimada"],
      purpose: "Evaluar función renal",
      frequency: "Según indicación médica"
    }
  },
  // Especialidades
  {
    id: 5,
    category: "especialidad",
    name: "Perfil Tiroideo Completo",
    description: "Evaluación completa de función tiroidea",
    price: 120000,
    timeDelivery: "24 horas",
    preparation: "No requiere",
    sample: "Sangre venosa",
    popular: true,
    tags: ["Hormonal", "Tiroides"],
    details: {
      includes: ["TSH", "T3", "T4", "T3L", "T4L", "Anti-TPO"],
      purpose: "Diagnóstico de enfermedades tiroideas",
      frequency: "Según síntomas o control"
    }
  },
  {
    id: 6,
    category: "especialidad",
    name: "Vitamina D",
    description: "Medición de niveles de vitamina D",
    price: 85000,
    timeDelivery: "48 horas",
    preparation: "No requiere",
    sample: "Sangre venosa",
    tags: ["Vitaminas", "Óseo"],
    details: {
      includes: ["25-hidroxi vitamina D"],
      purpose: "Evaluar deficiencia de vitamina D",
      frequency: "Anual o según necesidad"
    }
  },
  // Pediátricos
  {
    id: 7,
    category: "pediatrico",
    name: "Tamizaje Neonatal",
    description: "Detección temprana de enfermedades congénitas",
    price: 180000,
    timeDelivery: "72 horas",
    preparation: "No requiere",
    sample: "Sangre del talón",
    popular: true,
    tags: ["Recién nacido", "Preventivo"],
    details: {
      includes: ["TSH neonatal", "Fenilcetonuria", "Galactosemia", "Hiperplasia suprarrenal"],
      purpose: "Detección precoz de enfermedades metabólicas",
      frequency: "Una vez al nacer"
    }
  },
  {
    id: 8,
    category: "pediatrico",
    name: "Parasitológico",
    description: "Detección de parásitos intestinales",
    price: 30000,
    timeDelivery: "24 horas",
    preparation: "Muestra de materia fecal",
    sample: "Materia fecal",
    tags: ["Digestivo", "Niños"],
    details: {
      includes: ["Examen directo", "Concentración"],
      purpose: "Detectar parásitos intestinales",
      frequency: "Según síntomas"
    }
  },
  // Salud de la Mujer
  {
    id: 9,
    category: "mujer",
    name: "Perfil Hormonal Femenino",
    description: "Evaluación hormonal completa",
    price: 180000,
    timeDelivery: "48 horas",
    preparation: "Día específico del ciclo",
    sample: "Sangre venosa",
    popular: true,
    tags: ["Hormonal", "Fertilidad"],
    details: {
      includes: ["FSH", "LH", "Estradiol", "Progesterona", "Prolactina"],
      purpose: "Evaluar función reproductiva y hormonal",
      frequency: "Según indicación ginecológica"
    }
  },
  {
    id: 10,
    category: "mujer",
    name: "Citología Vaginal",
    description: "Detección de células anormales cervicales",
    price: 45000,
    timeDelivery: "5 días",
    preparation: "No tener menstruación",
    sample: "Muestra cervical",
    tags: ["Preventivo", "Cáncer"],
    details: {
      includes: ["Papanicolau", "Lectura especializada"],
      purpose: "Detección temprana de cáncer cervical",
      frequency: "Anual"
    }
  },
  // Ocupacional
  {
    id: 11,
    category: "ocupacional",
    name: "Perfil Pre-ocupacional",
    description: "Evaluación completa para ingreso laboral",
    price: 250000,
    timeDelivery: "24 horas",
    preparation: "Ayuno de 8 horas",
    sample: "Sangre y orina",
    popular: true,
    tags: ["Laboral", "Completo"],
    details: {
      includes: ["Hemograma", "Glicemia", "Creatinina", "Parcial de orina", "Serología"],
      purpose: "Evaluación de aptitud laboral",
      frequency: "Al ingreso laboral"
    }
  },
  {
    id: 12,
    category: "ocupacional",
    name: "Audiometría",
    description: "Evaluación de capacidad auditiva",
    price: 60000,
    timeDelivery: "Inmediato",
    preparation: "No exposición a ruido 14 horas",
    sample: "No aplica",
    tags: ["Auditivo", "Laboral"],
    details: {
      includes: ["Evaluación tonal", "Evaluación vocal"],
      purpose: "Detectar pérdida auditiva ocupacional",
      frequency: "Anual para trabajadores expuestos"
    }
  },
  // COVID-19
  {
    id: 13,
    category: "covid",
    name: "PCR COVID-19",
    description: "Detección molecular del virus",
    price: 150000,
    timeDelivery: "24 horas",
    preparation: "No requiere",
    sample: "Hisopado nasofaríngeo",
    popular: true,
    tags: ["COVID", "Diagnóstico"],
    details: {
      includes: ["RT-PCR SARS-CoV-2"],
      purpose: "Diagnóstico de infección activa",
      frequency: "Según síntomas o exposición"
    }
  },
  {
    id: 14,
    category: "covid",
    name: "Antígeno COVID-19",
    description: "Prueba rápida de detección",
    price: 50000,
    timeDelivery: "30 minutos",
    preparation: "No requiere",
    sample: "Hisopado nasal",
    tags: ["COVID", "Rápido"],
    details: {
      includes: ["Detección de antígeno viral"],
      purpose: "Detección rápida de infección",
      frequency: "Según necesidad"
    }
  }
];

const ServicesModal = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [view, setView] = useState("categories"); // categories, grid, detail
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [compareList, setCompareList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar servicios
  const filteredServices = useMemo(() => {
    let services = [...servicesDatabase];

    // Filtro por categoría
    if (selectedCategory !== "all") {
      services = services.filter(s => s.category === selectedCategory);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      services = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por precio
    if (priceFilter === "low") {
      services = services.filter(s => s.price <= 50000);
    } else if (priceFilter === "medium") {
      services = services.filter(s => s.price > 50000 && s.price <= 100000);
    } else if (priceFilter === "high") {
      services = services.filter(s => s.price > 100000);
    }

    // Ordenamiento
    if (sortBy === "popular") {
      services.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === "price-low") {
      services.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      services.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      services.sort((a, b) => a.name.localeCompare(b.name));
    }

    return services;
  }, [selectedCategory, searchTerm, priceFilter, sortBy]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setView("grid");
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setView("detail");
  };

  const handleCompareToggle = (service) => {
    if (compareList.find(s => s.id === service.id)) {
      setCompareList(compareList.filter(s => s.id !== service.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, service]);
    }
  };

  const handleBackClick = () => {
    if (view === "detail") {
      setView("grid");
    } else if (view === "grid") {
      setView("categories");
      setSelectedCategory("all");
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] md:h-[85vh] max-h-[900px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-biolab-blue to-biolab-turquoise p-4 md:p-6 text-white flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {view !== "categories" && (
                    <button
                      onClick={handleBackClick}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      {view === "categories" && "Catálogo de Servicios"}
                      {view === "grid" && (selectedCategory === "all" 
                        ? "Todos los Servicios" 
                        : categories.find(c => c.id === selectedCategory)?.name)}
                      {view === "detail" && selectedService?.name}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      {view === "categories" && "Explora nuestros servicios por categoría"}
                      {view === "grid" && `${filteredServices.length} servicios disponibles`}
                      {view === "detail" && selectedService?.category && 
                        categories.find(c => c.id === selectedService.category)?.name}
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

              {/* Barra de búsqueda y filtros */}
              {view === "grid" && (
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      placeholder="Buscar exámenes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                  </button>
                </div>
              )}
            </div>

            {/* Filtros expandibles */}
            {showFilters && view === "grid" && (
              <div className="bg-gray-50 p-4 border-b flex flex-wrap gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Precio:</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="px-3 py-1 border rounded-lg text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="low">Hasta $50.000</option>
                    <option value="medium">$50.000 - $100.000</option>
                    <option value="high">Más de $100.000</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border rounded-lg text-sm"
                  >
                    <option value="popular">Más populares</option>
                    <option value="name">Nombre A-Z</option>
                    <option value="price-low">Precio: menor a mayor</option>
                    <option value="price-high">Precio: mayor a menor</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contenido principal */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              {/* Vista de Categorías */}
              {view === "categories" && (
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const count = servicesDatabase.filter(s => s.category === category.id).length;
                      
                      return (
                        <motion.div
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={() => handleCategoryClick(category.id)}
                            className="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-biolab-turquoise hover:shadow-lg transition-all text-left group"
                          >
                            <div className={`${category.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {category.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {category.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                {count} servicios
                              </span>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-biolab-turquoise transition-colors" />
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                    
                    {/* Botón para ver todos */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => handleCategoryClick("all")}
                        className="w-full p-6 bg-gradient-to-br from-biolab-turquoise to-biolab-blue rounded-xl text-white hover:shadow-lg transition-all text-left group"
                      >
                        <div className="bg-white/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Microscope className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Ver Todos los Servicios
                        </h3>
                        <p className="text-white/80 text-sm mb-3">
                          Explora nuestro catálogo completo
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60">
                            {servicesDatabase.length} servicios totales
                          </span>
                          <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                      </button>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Vista Grid de Servicios */}
              {view === "grid" && (
                <div className="p-6 md:p-8">
                  {filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        No se encontraron servicios
                      </h3>
                      <p className="text-gray-500">
                        Intenta con otros términos de búsqueda o filtros
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {filteredServices.map((service) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
                        >
                          <div className="p-5">
                            {/* Header de la tarjeta */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 group-hover:text-biolab-turquoise transition-colors">
                                  {service.name}
                                </h3>
                                {service.popular && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full mt-1">
                                    <Star className="w-3 h-3" />
                                    Popular
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleCompareToggle(service)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  compareList.find(s => s.id === service.id)
                                    ? "bg-biolab-turquoise text-white"
                                    : "hover:bg-gray-100"
                                }`}
                                title="Comparar"
                              >
                                {compareList.find(s => s.id === service.id) ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <TrendingUp className="w-4 h-4" />
                                )}
                              </button>
                            </div>

                            {/* Descripción */}
                            <p className="text-sm text-gray-600 mb-4">
                              {service.description}
                            </p>

                            {/* Detalles */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Entrega: {service.timeDelivery}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Droplet className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{service.sample}</span>
                              </div>
                              {service.preparation !== "No requiere" && (
                                <div className="flex items-center gap-2 text-sm">
                                  <AlertCircle className="w-4 h-4 text-amber-500" />
                                  <span className="text-gray-600">{service.preparation}</span>
                                </div>
                              )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              {service.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <p className="text-2xl font-bold text-biolab-turquoise">
                                  ${service.price.toLocaleString('es-CO')}
                                </p>
                                <p className="text-xs text-gray-500">COP</p>
                              </div>
                              <button
                                onClick={() => handleServiceClick(service)}
                                className="px-4 py-2 bg-biolab-turquoise text-white rounded-lg hover:bg-biolab-blue transition-colors text-sm font-medium"
                              >
                                Ver detalles
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Vista Detalle del Servicio */}
              {view === "detail" && selectedService && (
                <div className="p-6 md:p-8">
                  <div className="max-w-4xl mx-auto">
                    {/* Información principal */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {selectedService.name}
                          </h1>
                          <p className="text-gray-600">
                            {selectedService.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {selectedService.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-biolab-turquoise/10 text-biolab-turquoise text-sm rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-biolab-turquoise">
                            ${selectedService.price.toLocaleString('es-CO')}
                          </p>
                          <p className="text-sm text-gray-500">COP</p>
                        </div>
                      </div>

                      {/* Grid de información */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-biolab-turquoise" />
                            <span className="font-medium text-gray-700">Tiempo de entrega</span>
                          </div>
                          <p className="text-gray-600">{selectedService.timeDelivery}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Droplet className="w-5 h-5 text-biolab-turquoise" />
                            <span className="font-medium text-gray-700">Tipo de muestra</span>
                          </div>
                          <p className="text-gray-600">{selectedService.sample}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            <span className="font-medium text-gray-700">Preparación</span>
                          </div>
                          <p className="text-gray-600">{selectedService.preparation}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-biolab-turquoise" />
                            <span className="font-medium text-gray-700">Frecuencia recomendada</span>
                          </div>
                          <p className="text-gray-600">{selectedService.details.frequency}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detalles adicionales */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Información detallada
                      </h2>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">¿Qué incluye?</h3>
                          <ul className="space-y-1">
                            {selectedService.details.includes.map((item, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-600">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">¿Para qué sirve?</h3>
                          <p className="text-gray-600">
                            {selectedService.details.purpose}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="bg-gradient-to-r from-biolab-turquoise/5 to-biolab-blue/5 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        ¿Listo para realizar este examen?
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => {
                            // Aquí podrías integrar con el modal de citas
                            console.log("Agendar cita para:", selectedService.name);
                          }}
                          className="flex-1 px-6 py-3 bg-biolab-turquoise text-white rounded-lg hover:bg-biolab-blue transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-5 h-5" />
                          Agendar cita
                        </button>
                        <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                          <Download className="w-5 h-5" />
                          Descargar información
                        </button>
                        <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                          <Share2 className="w-5 h-5" />
                          Compartir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Barra de comparación (si hay servicios seleccionados) */}
            {compareList.length > 0 && view === "grid" && (
              <div className="bg-gray-100 border-t p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Comparando {compareList.length} servicio{compareList.length > 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-2">
                    {compareList.map(service => (
                      <span key={service.id} className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCompareList([])}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    Limpiar
                  </button>
                  <button
                    className="px-4 py-2 bg-biolab-turquoise text-white rounded-lg hover:bg-biolab-blue transition-colors text-sm font-medium"
                  >
                    Comparar
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServicesModal;