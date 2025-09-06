import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, Building2, Stethoscope, 
  FileText, TestTube, 
  Shield, Package, Home,
  BookOpen, Users,
  UserCheck, Settings, Phone
} from 'lucide-react'

const QuickAccess = ({ onResultsClick }) => {
  const navigate = useNavigate()

  const accessCards = [
    {
      title: 'Soy Paciente',
      icon: User,
      color: 'bg-gradient-to-br from-biolab-turquoise to-biolab-blue-light',
      items: [
        { name: 'Resultados en Línea', icon: FileText, link: '#resultados', onClick: onResultsClick },
        { name: 'Exámenes Disponibles', icon: TestTube, link: '#examenes' },
        { name: 'Contactar Laboratorio', icon: Phone, link: '#contacto' }
      ]
    },
    {
      title: 'Soy Empresa',
      icon: Building2,
      color: 'bg-gradient-to-br from-biolab-blue to-biolab-blue-light',
      items: [
        { name: 'Salud Ocupacional', icon: Shield, link: '#salud-ocupacional' },
        { name: 'Paquetes Corporativos', icon: Package, link: '#paquetes' },
        { name: 'Toma de Muestras a Domicilio', icon: Home, link: '#domicilio' }
      ]
    },
    {
      title: 'Soy Médico',
      icon: Stethoscope,
      color: 'bg-gradient-to-br from-biolab-blue-light to-biolab-turquoise',
      items: [
        { name: 'Portal Médico', icon: Settings, onClick: () => navigate('/portal-empleados') },
        { name: 'Portafolio de Pruebas', icon: BookOpen, link: '#portafolio' },
        { name: 'Convenios Especiales', icon: Users, link: '#convenios' }
      ]
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-biolab-gray-dark mb-4">
            Acceso Rápido
          </h2>
          <p className="text-lg text-biolab-gray max-w-2xl mx-auto">
            Encuentra rápidamente los servicios que necesitas según tu perfil
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {accessCards.map((card, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 group-hover:shadow-2xl">
                <div className={`${card.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <card.icon className="w-12 h-12" />
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 5, delay: index * 0.5 }}
                      className="w-20 h-20 bg-white/10 rounded-full blur-xl"
                    />
                  </div>
                  <h3 className="text-2xl font-poppins font-bold">
                    {card.title}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {card.items.map((service, serviceIndex) => (
                    <motion.a
                      key={serviceIndex}
                      href={service.link}
                      onClick={(e) => {
                        if (service.onClick) {
                          e.preventDefault()
                          service.onClick()
                        }
                      }}
                      whileHover={{ x: 5 }}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group/item"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-biolab-turquoise/10 rounded-lg mr-3 group-hover/item:bg-biolab-turquoise/20 transition-colors">
                        <service.icon className="w-5 h-5 text-biolab-turquoise" />
                      </div>
                      <span className="text-biolab-gray-dark font-medium group-hover/item:text-biolab-turquoise transition-colors">
                        {service.name}
                      </span>
                    </motion.a>
                  ))}
                </div>

                <div className="px-6 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (index === 0) {
                        // Para pacientes, abrir modal de resultados
                        onResultsClick()
                      } else if (index === 2) {
                        // Para médicos, ir al portal
                        navigate('/portal-empleados')
                      }
                    }}
                    className={`w-full py-3 rounded-lg text-white font-semibold ${
                      index === 0 ? 'bg-biolab-turquoise hover:bg-biolab-blue' :
                      index === 1 ? 'bg-biolab-blue hover:bg-biolab-blue-light' :
                      'bg-biolab-blue-light hover:bg-biolab-turquoise'
                    } transition-colors duration-200`}
                  >
                    {index === 0 ? 'Ver Resultados' : 
                     index === 2 ? 'Acceder al Portal' : 
                     'Explorar Servicios'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12 p-6 bg-gradient-to-r from-biolab-turquoise/5 to-biolab-blue-light/5 rounded-2xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-biolab-gray-dark">
              ¿Eres empleado de BIOLAB? 
            </p>
            <motion.button
              onClick={() => navigate('/portal-empleados')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-biolab-turquoise text-white rounded-lg hover:bg-biolab-blue transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              Acceder al Portal Interno
            </motion.button>
          </div>
          <p className="text-biolab-gray-dark mt-4">
            ¿No encuentras lo que buscas? {' '}
            <a href="#contacto" className="text-biolab-turquoise font-semibold hover:text-biolab-blue transition-colors">
              Contáctanos
            </a>
            {' '} y te ayudaremos con gusto
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default QuickAccess