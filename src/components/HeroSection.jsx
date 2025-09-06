import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, FileText, InfoIcon } from 'lucide-react'
import PatientLoginModal from './PatientLoginModal'
import ResultsViewerModal from './ResultsViewerModal'

const HeroSection = ({ onServicesClick }) => {
  const [showPatientLogin, setShowPatientLogin] = useState(false)
  const [showResultsViewer, setShowResultsViewer] = useState(false)
  const [patientToken, setPatientToken] = useState(null)
  const [visitInfo, setVisitInfo] = useState(null)

  const features = [
    'Resultados confiables',
    'Atención personalizada',
    '21 años de experiencia'
  ]

  // Manejador del login exitoso del paciente
  const handlePatientLoginSuccess = (token, visit) => {
    setPatientToken(token)
    setVisitInfo(visit)
    setShowPatientLogin(false)
    setShowResultsViewer(true)
  }

  // Manejador para cerrar el visor de resultados
  const handleCloseResults = () => {
    setShowResultsViewer(false)
    // Limpiar datos después de un pequeño delay para evitar parpadeo
    setTimeout(() => {
      setPatientToken(null)
      setVisitInfo(null)
      localStorage.removeItem('patientToken')
    }, 300)
  }

  return (
    <>
      <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden header-offset">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 183, 183, 0.7), rgba(19, 110, 191, 0.7)), url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2070')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Patrón decorativo */}
        <div className="absolute inset-0 hero-gradient opacity-30 z-10" />

        {/* Contenido */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Badge - con mejor espaciado en móviles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mt-4 md:mt-0"
            >
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-green-400" />
              <span className="text-xs sm:text-sm font-medium">Certificados en ISO 9001:2015</span>
            </motion.div>

            {/* Título principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-white leading-tight"
            >
              Confianza, calidad y cercanía en{' '}
              <span className="text-yellow-300">diagnóstico clínico</span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-white/90 font-light px-4"
            >
              Apoyando tu bienestar y el de tu empresa con resultados precisos y un servicio humano. 
              Más de dos décadas cuidando la salud de miles de colombianos.
            </motion.p>

            {/* Características */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4 md:gap-8"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Botones CTA - Solo 2 botones ahora */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              {/* Botón Ver Resultados - Principal */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPatientLogin(true)}
                className="group flex items-center px-8 py-4 bg-yellow-400 text-biolab-gray-dark rounded-full font-semibold text-lg shadow-xl hover:bg-yellow-300 transition-all duration-200"
              >
                <FileText className="w-5 h-5 mr-3" />
                Consultar Resultados
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Botón Ver Servicios - Secundario */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onServicesClick}
                className="flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-full font-semibold text-lg hover:bg-white hover:text-biolab-turquoise transition-all duration-200"
              >
                <InfoIcon className="w-5 h-5 mr-3" />
                Conocer Servicios
              </motion.button>
            </motion.div>

            {/* Información adicional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="pt-6"
            >
              <p className="text-white/80 text-sm">
                Atención presencial: Lunes a Sábado 6:00 AM - 4:00 PM | 
                <span className="ml-2">📍 Soacha, Cundinamarca</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modales del Portal de Pacientes */}
      <PatientLoginModal 
        isOpen={showPatientLogin}
        onClose={() => setShowPatientLogin(false)}
        onLoginSuccess={handlePatientLoginSuccess}
      />

      <ResultsViewerModal
        isOpen={showResultsViewer}
        onClose={handleCloseResults}
        token={patientToken}
        visitInfo={visitInfo}
      />
    </>
  )
}

export default HeroSection