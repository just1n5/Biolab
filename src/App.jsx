import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import QuickAccess from './components/QuickAccess'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import SstSection from './components/SstSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import ResultsModal from './components/ResultsModal'
import ServicesModal from './components/ServicesModal'
import SstQuoteModal from './components/SstQuoteModal'
import SstPortfolioModal from './components/SstPortfolioModal'
import EmployeePortal from './pages/EmployeePortal'

// Componente para la página principal
const HomePage = () => {
  const [scrolled, setScrolled] = useState(false)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false)
  const [isSstQuoteModalOpen, setIsSstQuoteModalOpen] = useState(false)
  const [isSstPortfolioModalOpen, setIsSstPortfolioModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        scrolled={scrolled} 
        onResultsClick={() => setIsResultsModalOpen(true)} 
      />
      <HeroSection 
        onServicesClick={() => setIsServicesModalOpen(true)} 
      />
      <QuickAccess 
        onResultsClick={() => setIsResultsModalOpen(true)}
      />
      <AboutSection />
      <ServicesSection onServicesClick={() => setIsServicesModalOpen(true)} />
      <SstSection 
        onQuoteClick={() => setIsSstQuoteModalOpen(true)}
        onPortfolioClick={() => setIsSstPortfolioModalOpen(true)}
      />
      <ContactSection />
      <Footer />
      <ResultsModal
        isOpen={isResultsModalOpen}
        onClose={() => setIsResultsModalOpen(false)}
      />
      <ServicesModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
      />
      <SstQuoteModal
        isOpen={isSstQuoteModalOpen}
        onClose={() => setIsSstQuoteModalOpen(false)}
      />
      <SstPortfolioModal
        isOpen={isSstPortfolioModalOpen}
        onClose={() => setIsSstPortfolioModalOpen(false)}
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal del sitio web */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta del portal de empleados */}
        <Route path="/portal-empleados" element={<EmployeePortal />} />
        
        {/* Ruta 404 - Página no encontrada */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
              <a 
                href="/" 
                className="px-6 py-3 bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white rounded-full hover:shadow-lg transition-all"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App