import { motion } from 'framer-motion'
import { 
  Phone, Mail, MapPin, Clock, 
  Heart, Shield, FileText,
  Award, ChevronRight
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    servicios: [
      { name: 'Exámenes Clínicos', href: '#examenes' },
      { name: 'Salud Ocupacional', href: '#salud-ocupacional' },
      { name: 'Logística de Muestras', href: '#logistica' },
      { name: 'Toma de Muestras a Domicilio', href: '#domicilio' },
      { name: 'Convenios Empresariales', href: '#convenios' }
    ],
    empresa: [
      { name: 'Quiénes Somos', href: '#nosotros' },
      { name: 'Misión y Visión', href: '#mision' },
      { name: 'Política de Calidad', href: '#calidad' },
      { name: 'Certificaciones', href: '#certificaciones' },
      { name: 'Trabaja con Nosotros', href: '#empleo' }
    ],
    recursos: [
      { name: 'Resultados en Línea', href: '#resultados' },
      { name: 'Preparación de Exámenes', href: '#preparacion' },
      { name: 'Blog de Salud', href: '#blog' },
      { name: 'Preguntas Frecuentes', href: '#faq' },
      { name: 'Descargar App', href: '#app' }
    ],
    legal: [
      { name: 'Política de Privacidad', href: '#privacidad' },
      { name: 'Términos y Condiciones', href: '#terminos' },
      { name: 'Política de Cookies', href: '#cookies' },
      { name: 'Habeas Data', href: '#habeas-data' },
      { name: 'PQRS', href: '#pqrs' }
    ]
  }

  return (
    <footer className="bg-biolab-gray-dark text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h2 className="text-3xl font-poppins font-bold text-white">
                BIOLAB
              </h2>
              <p className="text-biolab-turquoise text-sm">
                Laboratorio Clínico S.A.S.
              </p>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Más de 21 años brindando servicios de diagnóstico clínico con 
              calidad, confianza y cercanía a miles de colombianos.
            </p>
            
            {/* Certificaciones */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
                <Award className="w-6 h-6 text-biolab-turquoise" />
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
                <Shield className="w-6 h-6 text-biolab-turquoise" />
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
                <FileText className="w-6 h-6 text-biolab-turquoise" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              ISO 9001:2015 Certificado
            </p>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-lg font-poppins font-semibold mb-4 text-biolab-turquoise">
              Servicios
            </h4>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link, index) => (
                <motion.li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-poppins font-semibold mb-4 text-biolab-turquoise">
              Empresa
            </h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link, index) => (
                <motion.li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-poppins font-semibold mb-4 text-biolab-turquoise">
              Recursos
            </h4>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link, index) => (
                <motion.li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-poppins font-semibold mb-4 text-biolab-turquoise">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="w-4 h-4 text-biolab-turquoise mr-2 flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <p className="text-gray-400">Salud Ocupacional</p>
                  <p className="text-white">+57 318 123 4567</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 text-biolab-turquoise mr-2 flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">contacto@biolabsas.com</p>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-biolab-turquoise mr-2 flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <p className="text-gray-400">Dirección</p>
                  <p className="text-white">Cra. 45a #95-70<br />Bogotá D.C., Colombia</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="w-4 h-4 text-biolab-turquoise mr-2 flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <p className="text-gray-400">Horario</p>
                  <p className="text-white">Lun-Vie: 7:00AM - 6:00PM<br />Sáb: 7:00AM - 1:00PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {footerLinks.legal.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-biolab-turquoise transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Laboratorio Clínico BIOLAB S.A.S. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-2 flex items-center justify-center">
            Hecho con <Heart className="w-3 h-3 mx-1 text-red-500" /> en Colombia
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
