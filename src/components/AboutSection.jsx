import { motion } from 'framer-motion'
import { 
  Award, Clock, Truck, Target, Eye,
  CheckCircle, Users, Shield, Heart,
  TrendingUp, Brain, Sparkles
} from 'lucide-react'

const AboutSection = () => {
  const achievements = [
    {
      number: '21',
      label: 'Años en Diagnóstico Clínico',
      icon: Award,
      color: 'text-biolab-turquoise'
    },
    {
      number: '15',
      label: 'Años en Salud Ocupacional',
      icon: Shield,
      color: 'text-biolab-blue'
    },
    {
      number: '11',
      label: 'Años en Logística',
      icon: Truck,
      color: 'text-biolab-blue-light'
    }
  ]

  const qualityPoints = [
    'Satisfacción del cliente y bienestar del paciente',
    'Personal altamente calificado y en constante formación',
    'Servicios seguros con tecnología de última generación',
    'Cumplimiento de normativas nacionales e internacionales',
    'Mejora continua en todos nuestros procesos',
    'Compromiso con la comunidad y el medio ambiente'
  ]

  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-biolab-gray-dark mb-4">
            Quiénes Somos
          </h2>
          <p className="text-lg text-biolab-gray max-w-3xl mx-auto">
            Somos un laboratorio clínico comprometido con la excelencia, brindando servicios de diagnóstico 
            confiables y oportunos para mejorar la calidad de vida de nuestros pacientes.
          </p>
        </motion.div>

        {/* Grid de logros */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`text-5xl font-poppins font-bold ${achievement.color}`}>
                  {achievement.number}
                </div>
                <achievement.icon className={`w-10 h-10 ${achievement.color} opacity-50`} />
              </div>
              <p className="text-biolab-gray-dark font-semibold">
                {achievement.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Misión */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-biolab-turquoise/5 to-biolab-blue-light/5 p-8 rounded-2xl"
          >
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-biolab-turquoise mr-3" />
              <h3 className="text-2xl font-poppins font-bold text-biolab-gray-dark">
                Nuestra Misión
              </h3>
            </div>
            <p className="text-biolab-gray leading-relaxed">
              Brindar servicios de diagnóstico clínico integral y salud ocupacional con los más altos 
              estándares de calidad, apoyándonos en tecnología de vanguardia y un equipo humano comprometido 
              con el bienestar de nuestros pacientes y la satisfacción de nuestros clientes corporativos.
            </p>
          </motion.div>

          {/* Visión */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-biolab-blue/5 to-biolab-turquoise/5 p-8 rounded-2xl"
          >
            <div className="flex items-center mb-4">
              <Eye className="w-8 h-8 text-biolab-blue mr-3" />
              <h3 className="text-2xl font-poppins font-bold text-biolab-gray-dark">
                Nuestra Visión
              </h3>
            </div>
            <p className="text-biolab-gray leading-relaxed">
              Ser reconocidos como el laboratorio clínico líder en la región, destacándonos por nuestra 
              innovación continua, precisión diagnóstica y compromiso inquebrantable con la salud de la 
              comunidad, expandiendo nuestra presencia y servicios a nivel nacional.
            </p>
          </motion.div>
        </div>

        {/* Política de Calidad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-10 shadow-lg"
        >
          <div className="flex items-center mb-6">
            <Shield className="w-10 h-10 text-biolab-turquoise mr-4" />
            <h3 className="text-2xl font-poppins font-bold text-biolab-gray-dark">
              Nuestra Política de Calidad y Seguridad del Paciente
            </h3>
          </div>
          
          <p className="text-biolab-gray mb-6 leading-relaxed">
            En BIOLAB S.A.S. nos comprometemos a garantizar la excelencia en cada uno de nuestros procesos,
            asegurando resultados confiables y un servicio que supere las expectativas de nuestros usuarios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-start"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-biolab-gray-dark">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Valores corporativos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-poppins font-bold text-biolab-gray-dark text-center mb-8">
            Nuestros Valores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Heart, name: 'Compromiso', color: 'text-red-500' },
              { icon: Users, name: 'Trabajo en Equipo', color: 'text-blue-500' },
              { icon: TrendingUp, name: 'Mejora Continua', color: 'text-green-500' },
              { icon: Brain, name: 'Innovación', color: 'text-purple-500' },
              { icon: Shield, name: 'Integridad', color: 'text-yellow-500' },
              { icon: Sparkles, name: 'Excelencia', color: 'text-pink-500' },
              { icon: Heart, name: 'Empatía', color: 'text-indigo-500' },
              { icon: Award, name: 'Calidad', color: 'text-biolab-turquoise' }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <value.icon className={`w-8 h-8 ${value.color} mb-2`} />
                <span className="text-sm font-medium text-biolab-gray-dark text-center">
                  {value.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
