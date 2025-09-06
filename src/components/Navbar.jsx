import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, FileText, Phone, MapPin } from 'lucide-react'
import BiolabIcon from './Icons/BiolabIconComponent'
import PatientLoginModal from './PatientLoginModal'
import ResultsViewerModal from './ResultsViewerModal'

const Navbar = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showPatientLogin, setShowPatientLogin] = useState(false)
  const [showResultsViewer, setShowResultsViewer] = useState(false)
  const [patientToken, setPatientToken] = useState(null)
  const [visitInfo, setVisitInfo] = useState(null)

  const menuItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Quiénes somos', href: '#nosotros' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Salud Ocupacional', href: '#salud-ocupacional' },
    { name: 'Contáctenos', href: '#contacto' }
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
    setTimeout(() => {
      setPatientToken(null)
      setVisitInfo(null)
      localStorage.removeItem('patientToken')
    }, 300)
  }

  return (
    <>
      {/* Overlay oscuro cuando el menú está abierto */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 navbar-blur shadow-md py-4' 
            : 'bg-transparent py-6'
        }`}
      >
      <div className="w-full px-6 sm:px-8 lg:px-14 xl:px-12 2xl:px-12">
        <div className="flex items-center justify-between">
          {/* Logo - Más a la izquierda con mejor espaciado */}
          <div className="flex-shrink-0">
            <a href="#inicio" className="flex items-center group">
              <div className="flex items-center space-x-3">
                {/* Ícono del logo de Biolab */}
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                  scrolled 
                    ? 'bg-gradient-to-br from-biolab-turquoise/10 to-biolab-blue/10' 
                    : 'bg-white/10 backdrop-blur-sm'
                }`}>
                  <BiolabIcon 
                    width={32} 
                    height={40}
                    className={`transition-all duration-300 ${
                      scrolled ? 'text-biolab-turquoise' : 'text-white'
                    }`}
                  />
                </div>
                {/* Texto del logo */}
                <div>
                  <div className={`font-poppins font-bold text-2xl lg:text-[28px] tracking-tight transition-colors duration-300 ${
                    scrolled ? 'text-biolab-turquoise' : 'text-white'
                  }`}>
                    BIOLAB
                  </div>
                  <div className={`text-[11px] lg:text-xs tracking-wider uppercase transition-colors duration-300 ${
                    scrolled ? 'text-biolab-gray' : 'text-white/70'
                  }`}>
                    Laboratorio Clínico
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Espaciador central para empujar el menú */}
          <div className="hidden lg:block flex-1" />

          {/* Menu Desktop - Con mejor distribución */}
          <div className="hidden lg:flex items-center gap-20">
            {/* Menu de navegación */}
            <nav className="flex items-center gap-12">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative font-medium text-[15px] transition-all duration-200 hover:text-biolab-turquoise group ${
                    scrolled ? 'text-biolab-gray-dark' : 'text-white'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    scrolled ? 'bg-biolab-turquoise' : 'bg-white'
                  }`} />
                </a>
              ))}
            </nav>

            {/* Botones CTA - Simplificado con solo Resultados y contacto */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowPatientLogin(true)}
                className="flex items-center px-5 py-2.5 bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white rounded-full font-medium text-[14px] shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Resultados
              </motion.button>
              
              {/* Información de contacto rápido */}
              <div className={`hidden xl:flex items-center gap-4 ml-4 ${
                scrolled ? 'text-biolab-gray' : 'text-white/90'
              }`}>
                <a href="tel:+573181234567" className="flex items-center gap-1 hover:text-biolab-turquoise transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">318 123 4567</span>
                </a>
              </div>
            </div>
          </div>

          {/* Botón menú móvil */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                scrolled 
                  ? 'text-biolab-gray-dark hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            height: isOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden"
        >
          <div className={`pt-4 pb-3 px-2 space-y-2 mt-2 rounded-xl ${
            scrolled 
              ? 'bg-white shadow-lg' 
              : 'bg-gradient-to-br from-biolab-turquoise/95 to-biolab-blue/95 backdrop-blur-xl shadow-2xl border border-white/20'
          }`}>
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  scrolled 
                    ? 'text-biolab-gray-dark hover:bg-biolab-turquoise/10 hover:text-biolab-turquoise' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {item.name}
              </a>
            ))}
            
            {/* Sección de acciones en móvil */}
            <div className="pt-3 space-y-2 px-2 border-t border-white/20">
              <button 
                onClick={() => {
                  setShowPatientLogin(true)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-center px-5 py-2.5 rounded-full font-medium transition-colors duration-200 ${
                  scrolled
                    ? 'bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white hover:shadow-lg'
                    : 'bg-yellow-400 text-biolab-gray-dark hover:bg-yellow-300'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Consultar Resultados
              </button>
              
              {/* Información de contacto en móvil */}
              <div className={`flex flex-col items-center gap-2 pt-2 ${
                scrolled ? 'text-biolab-gray-dark' : 'text-white'
              }`}>
                <a href="tel:+573181234567" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">318 123 4567</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Soacha, Cundinamarca</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>

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

export default Navbar