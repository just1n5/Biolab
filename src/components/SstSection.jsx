import { motion } from 'framer-motion'
import { 
  Shield, Heart, AlertTriangle, Users, 
  CheckCircle, TrendingUp, Award, Target,
  Activity, FileCheck, Briefcase, UserCheck
} from 'lucide-react'

const SstSection = ({ onQuoteClick, onPortfolioClick }) => {
  const sstPolicies = [
    {
      icon: Heart,
      title: 'Bienestar Integral',
      description: 'Promovemos la salud física y mental de todos los trabajadores'
    },
    {
      icon: Shield,
      title: 'Prevención de Riesgos',
      description: 'Identificamos y controlamos los peligros en el ambiente laboral'
    },
    {
      icon: Users,
      title: 'Capacitación Continua',
      description: 'Formación permanente en seguridad y salud en el trabajo'
    },
    {
      icon: AlertTriangle,
      title: 'Gestión de Emergencias',
      description: 'Protocolos claros para responder ante situaciones de riesgo'
    },
    {
      icon: TrendingUp,
      title: 'Mejora Continua',
      description: 'Evaluación constante para optimizar nuestros procesos de SST'
    },
    {
      icon: Award,
      title: 'Cumplimiento Legal',
      description: 'Adherencia total a la normativa nacional en SST'
    }
  ]

  const sstServices = [
    {
      icon: UserCheck,
      name: 'Exámenes Médicos Ocupacionales',
      items: ['Ingreso', 'Periódicos', 'Retiro', 'Post-incapacidad']
    },
    {
      icon: Activity,
      name: 'Pruebas Complementarias',
      items: ['Audiometría', 'Optometría', 'Espirometría', 'Electrocardiograma']
    },
    {
      icon: Briefcase,
      name: 'Programas de Vigilancia',
      items: ['Riesgo Biomecánico', 'Riesgo Psicosocial', 'Conservación Auditiva', 'Conservación Visual']
    },
    {
      icon: FileCheck,
      name: 'Asesoría y Consultoría',
      items: ['Diseño SG-SST', 'Auditorías', 'Capacitaciones', 'Matriz de Riesgos']
    }
  ]

  return (
    <section id="salud-ocupacional" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-biolab-turquoise/10 rounded-full mb-4">
            <Shield className="w-10 h-10 text-biolab-turquoise" />
          </div>
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-biolab-gray-dark mb-4">
            Sistema de Gestión de Seguridad y Salud en el Trabajo
          </h2>
          <p className="text-lg text-biolab-gray max-w-3xl mx-auto">
            Comprometidos con crear ambientes laborales seguros y saludables para todas las empresas
          </p>
        </motion.div>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Columna izquierda - Imagen y estadísticas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070"
                alt="Seguridad y Salud en el Trabajo"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-biolab-gray-dark/80 to-transparent" />
              
              {/* Estadísticas superpuestas */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">500+</div>
                    <div className="text-sm text-white/80">Empresas Atendidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">15K+</div>
                    <div className="text-sm text-white/80">Trabajadores Evaluados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">99%</div>
                    <div className="text-sm text-white/80">Satisfacción</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decoración flotante */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-biolab-turquoise/20 rounded-full blur-2xl"
            />
          </motion.div>

          {/* Columna derecha - Política SST */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-poppins font-bold text-biolab-gray-dark mb-6">
              Nuestra Política de Seguridad y Salud en el Trabajo
            </h3>
            
            <p className="text-biolab-gray mb-6 leading-relaxed">
              En BIOLAB S.A.S. estamos comprometidos con la implementación y mejora continua del 
              Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST), garantizando condiciones 
              laborales seguras y saludables para todos nuestros colaboradores y partes interesadas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sstPolicies.map((policy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-biolab-turquoise/10 rounded-lg flex items-center justify-center mr-3">
                    <policy.icon className="w-5 h-5 text-biolab-turquoise" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-biolab-gray-dark text-sm mb-1">
                      {policy.title}
                    </h4>
                    <p className="text-xs text-biolab-gray">
                      {policy.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Servicios SST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10"
        >
          <h3 className="text-2xl font-poppins font-bold text-biolab-gray-dark text-center mb-8">
            Servicios Especializados en Salud Ocupacional
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sstServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-biolab-blue/10 rounded-lg flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-biolab-blue" />
                  </div>
                </div>
                <h4 className="font-semibold text-biolab-gray-dark mb-3">
                  {service.name}
                </h4>
                <ul className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-biolab-gray">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-biolab-turquoise to-biolab-blue rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-poppins font-bold mb-4">
            ¿Necesitas implementar o mejorar tu SG-SST?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de expertos está listo para asesorarte y acompañarte en el cumplimiento 
            de toda la normativa vigente en Seguridad y Salud en el Trabajo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onQuoteClick}
              className="px-8 py-3 bg-white text-biolab-turquoise rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Solicitar Cotización
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPortfolioClick}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors duration-200"
            >
              Descargar Portafolio SST
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SstSection
