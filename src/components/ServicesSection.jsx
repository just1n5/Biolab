import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TestTube, Heart, Activity, Eye, Ear, Brain,
  Droplet, Shield, Truck, Package, ChevronRight,
  Microscope, Stethoscope, FileText, Syringe,
  Baby, Users, Home, Clock, CheckCircle
} from 'lucide-react'

const ServicesSection = ({ onServicesClick }) => {
  const [selectedCategory, setSelectedCategory] = useState(0)

  const services = [
    {
      title: 'Exámenes Clínicos',
      icon: TestTube,
      color: 'bg-gradient-to-br from-biolab-turquoise to-biolab-blue-light',
      description: 'Análisis clínicos completos con tecnología de última generación',
      items: [
        { name: 'Perfil Lipídico', icon: Heart, description: 'Colesterol total, HDL, LDL, Triglicéridos' },
        { name: 'Cuadro Hemático', icon: Droplet, description: 'Hemograma completo con recuento diferencial' },
        { name: 'Glicemia', icon: Activity, description: 'Niveles de glucosa en sangre' },
        { name: 'Uroanálisis', icon: Microscope, description: 'Análisis completo de orina' },
        { name: 'Pruebas Tiroideas', icon: Brain, description: 'TSH, T3, T4 libre' },
        { name: 'Marcadores Tumorales', icon: Shield, description: 'PSA, CA 19-9, CA 125, CEA' },
        { name: 'Pruebas de Embarazo', icon: Baby, description: 'HCG cuantitativa y cualitativa' },
        { name: 'Perfil Hepático', icon: FileText, description: 'Transaminasas, bilirrubinas, fosfatasa' }
      ]
    },
    {
      title: 'Salud Ocupacional',
      icon: Shield,
      color: 'bg-gradient-to-br from-biolab-blue to-biolab-blue-light',
      description: 'Servicios especializados para empresas y sus colaboradores',
      items: [
        { name: 'Optometría', icon: Eye, description: 'Evaluación completa de agudeza visual' },
        { name: 'Audiometría', icon: Ear, description: 'Evaluación de capacidad auditiva' },
        { name: 'Espirometría', icon: Activity, description: 'Evaluación de función pulmonar' },
        { name: 'Exámenes de Ingreso', icon: Users, description: 'Evaluación médica pre-ocupacional' },
        { name: 'Exámenes Periódicos', icon: Clock, description: 'Seguimiento de salud laboral' },
        { name: 'Exámenes de Retiro', icon: FileText, description: 'Evaluación médica post-ocupacional' },
        { name: 'Pruebas Psicotécnicas', icon: Brain, description: 'Evaluación de aptitudes y competencias' },
        { name: 'Vacunación Corporativa', icon: Syringe, description: 'Programas de inmunización empresarial' }
      ]
    },
    {
      title: 'Logística de Muestras',
      icon: Truck,
      color: 'bg-gradient-to-br from-biolab-blue-light to-biolab-turquoise',
      description: 'Servicio integral de recolección y transporte de muestras',
      items: [
        { name: 'Recolección Programada', icon: Clock, description: 'Visitas periódicas a su institución' },
        { name: 'Embalaje Especializado', icon: Package, description: 'Conservación óptima de muestras' },
        { name: 'Transporte Refrigerado', icon: Truck, description: 'Cadena de frío garantizada' },
        { name: 'Toma de Muestras a Domicilio', icon: Home, description: 'Servicio puerta a puerta' },
        { name: 'Cobertura Regional', icon: Shield, description: 'Alcance en toda la región' },
        { name: 'Trazabilidad Completa', icon: FileText, description: 'Seguimiento en tiempo real' },
        { name: 'Protocolos de Bioseguridad', icon: Shield, description: 'Máxima seguridad en el manejo' },
        { name: 'Atención 24/7', icon: Clock, description: 'Servicio de emergencias disponible' }
      ]
    }
  ]

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-biolab-gray-dark mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-biolab-gray max-w-3xl mx-auto">
            Ofrecemos una amplia gama de servicios de diagnóstico y salud ocupacional 
            con los más altos estándares de calidad
          </p>
        </motion.div>

        {/* Tabs de categorías */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(index)}
              className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === index
                  ? 'bg-biolab-turquoise text-white shadow-lg'
                  : 'bg-white text-biolab-gray-dark shadow-md hover:shadow-lg'
              }`}
            >
              <service.icon className="w-5 h-5 mr-2" />
              {service.title}
            </motion.button>
          ))}
        </div>

        {/* Contenido de la categoría seleccionada */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header de la categoría */}
            <div className={`${services[selectedCategory].color} rounded-t-3xl p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-poppins font-bold mb-2">
                    {services[selectedCategory].title}
                  </h3>
                  <p className="text-white/90">
                    {services[selectedCategory].description}
                  </p>
                </div>
                {(() => {
                  const IconComponent = services[selectedCategory].icon
                  return <IconComponent className="w-16 h-16 text-white/20" />
                })()}
              </div>
            </div>

            {/* Grid de servicios */}
            <div className="bg-white rounded-b-3xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services[selectedCategory].items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-biolab-turquoise/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-biolab-turquoise/20 transition-colors">
                        <item.icon className="w-5 h-5 text-biolab-turquoise" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-biolab-gray-dark mb-1 group-hover:text-biolab-turquoise transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-biolab-gray">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA de la categoría */}
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onServicesClick}
                  className="inline-flex items-center px-8 py-3 bg-biolab-turquoise text-white rounded-full font-semibold hover:bg-biolab-blue transition-colors duration-200"
                >
                  Ver todos los {services[selectedCategory].title.toLowerCase()}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mensaje de certificación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-biolab-turquoise/10 to-biolab-blue/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <p className="text-biolab-gray-dark font-medium">
              Todos nuestros procesos están certificados bajo la norma ISO 9001:2015 
              garantizando la máxima calidad en nuestros servicios
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesSection
