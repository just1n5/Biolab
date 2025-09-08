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
      value: 'Cra. 45a #95-70\nBogotá D.C., Colombia',
      color: 'text-red-500',
      link: 'https://www.google.com/maps/search/Cra.+45a+%2395-70,+Bogot%C3%A1,+Colombia'
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

            {/* Mapa - Ubicación real de BIOLAB en Bogotá */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-80 relative">
                {/* Iframe del mapa con la ubicación real en Cra. 45a #95-70, Bogotá */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5087!2d-74.0527!3d4.6811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCra.%2045a%20%2395-70%2C%20La%20Castellana%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación BIOLAB - Bogotá"
                  className="absolute inset-0"
                />
                
                {/* Overlay con botón para abrir en Google Maps */}
                <div className="absolute bottom-4 left-4 right-4">
                  <motion.a
                    href="https://www.google.com/maps/search/Cra.+45a+%2395-70,+Bogot%C3%A1,+Colombia"
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


          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection