import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, Mail, MapPin, Clock, Send,
  MessageCircle, PhoneCall, ExternalLink,
  AlertCircle, FileText, ThumbsUp, Smile, Navigation
} from 'lucide-react'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono Principal',
      value: '+57 318 123 4567',
      color: 'text-biolab-turquoise',
      link: 'tel:+573181234567'
    },
    {
      icon: Mail,
      title: 'Correo Electrónico',
      value: 'contacto@biolabsas.com',
      color: 'text-biolab-blue-light',
      link: 'mailto:contacto@biolabsas.com'
    },
    {
      icon: MapPin,
      title: 'Dirección',
      value: 'Carrera 8 #11-45, San Mateo\nSoacha, Cundinamarca',
      color: 'text-red-500',
      link: 'https://maps.app.goo.gl/6P14TSPyoivXogh29'
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      value: 'Lunes a Sábado\n6:00 AM - 4:00 PM',
      color: 'text-green-500'
    }
  ]

  const pqrsTypes = [
    { value: 'felicitacion', label: 'Felicitación', icon: Smile },
    { value: 'queja', label: 'Queja', icon: AlertCircle },
    { value: 'reclamo', label: 'Reclamo', icon: FileText },
    { value: 'sugerencia', label: 'Sugerencia', icon: ThumbsUp }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Mensaje enviado con éxito. Nos pondremos en contacto pronto.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contacto" className="py-20 bg-gray-50">
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
            Contáctanos
          </h2>
          <p className="text-lg text-biolab-gray max-w-2xl mx-auto">
            Estamos aquí para atenderte. Envíanos tus consultas, sugerencias o solicitudes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna Izquierda - Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-poppins font-bold text-biolab-gray-dark mb-6">
                Sistema PQRS
              </h3>
              <p className="text-biolab-gray mb-6">
                Tu opinión es importante para nosotros. Usa este formulario para enviarnos 
                tus peticiones, quejas, reclamos o sugerencias.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-biolab-gray-dark mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent transition-all duration-200"
                    placeholder="Juan Pérez"
                  />
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-medium text-biolab-gray-dark mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent transition-all duration-200"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                {/* Tipo de solicitud */}
                <div>
                  <label className="block text-sm font-medium text-biolab-gray-dark mb-2">
                    Tipo de solicitud *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {pqrsTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.subject === type.value
                            ? 'border-biolab-turquoise bg-biolab-turquoise/5'
                            : 'border-gray-200 hover:border-biolab-turquoise/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="subject"
                          value={type.value}
                          checked={formData.subject === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <type.icon className={`w-5 h-5 mr-2 ${
                          formData.subject === type.value
                            ? 'text-biolab-turquoise'
                            : 'text-biolab-gray'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.subject === type.value
                            ? 'text-biolab-turquoise'
                            : 'text-biolab-gray-dark'
                        }`}>
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-biolab-gray-dark mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                {/* Botón de envío */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-biolab-turquoise text-white hover:bg-biolab-blue'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Columna Derecha - Información de contacto y mapa */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Información de contacto */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-poppins font-bold text-biolab-gray-dark mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-start"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4`}>
                      <info.icon className={`w-5 h-5 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-biolab-gray-dark text-sm mb-1">
                        {info.title}
                      </h4>
                      {info.link ? (
                        <a 
                          href={info.link}
                          target={info.link.includes('maps') ? '_blank' : undefined}
                          rel={info.link.includes('maps') ? 'noopener noreferrer' : undefined}
                          className="text-biolab-gray text-sm whitespace-pre-line hover:text-biolab-turquoise transition-colors inline-flex items-start gap-1"
                        >
                          {info.value}
                          {info.link.includes('maps') && (
                            <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          )}
                        </a>
                      ) : (
                        <p className="text-biolab-gray text-sm whitespace-pre-line">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 mt-6">
                <motion.a
                  href="https://wa.me/573181234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </motion.a>
                <motion.a
                  href="tel:+573181234567"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-biolab-turquoise to-biolab-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <PhoneCall className="w-5 h-5 mr-2" />
                  Llamar
                </motion.a>
              </div>
            </div>

            {/* Mapa - Ubicación real de BIOLAB en Soacha */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-80 relative">
                {/* Iframe del mapa con la ubicación correcta en Soacha */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.1456!2d-74.2217!3d4.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f98b7c7b7c7b7%3A0x1234567890abcdef!2sCarrera%208%20%2311-45%2C%20Soacha%2C%20Cundinamarca!5e0!3m2!1ses!2sco!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación BIOLAB - Soacha"
                  className="absolute inset-0"
                />
                
                {/* Overlay con botón para abrir en Google Maps */}
                <div className="absolute bottom-4 left-4 right-4">
                  <motion.a
                    href="https://maps.app.goo.gl/6P14TSPyoivXogh29"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all"
                  >
                    <Navigation className="w-5 h-5 text-biolab-turquoise" />
                    <span className="font-medium text-biolab-gray-dark">Ver en Google Maps</span>
                    <ExternalLink className="w-4 h-4 text-biolab-gray" />
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="bg-gradient-to-r from-biolab-turquoise/10 to-biolab-blue/10 rounded-3xl p-6">
              <h4 className="font-semibold text-biolab-gray-dark mb-4">
                Síguenos en nuestras redes
              </h4>
              <div className="flex space-x-4">
                {/* Facebook */}
                <motion.a
                  href="https://facebook.com/biolabsas"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 group"
                  aria-label="Facebook"
                >
                  <svg 
                    className="w-5 h-5 text-biolab-turquoise group-hover:text-biolab-blue transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                
                {/* Instagram */}
                <motion.a
                  href="https://instagram.com/biolabsas"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 group"
                  aria-label="Instagram"
                >
                  <svg 
                    className="w-6 h-6 text-biolab-turquoise group-hover:text-pink-500 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection