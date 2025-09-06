// src/components/PatientLoginModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, User, CreditCard, Key, Loader2 } from 'lucide-react';

const PatientLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    documentType: 'CC',
    documentNumber: '',
    attentionCode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const documentTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PA', label: 'Pasaporte' },
    { value: 'RC', label: 'Registro Civil' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error cuando el usuario escribe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!formData.documentNumber || !formData.attentionCode) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }

    if (formData.attentionCode.length !== 8) {
      setError('El código de atención debe tener 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/patient/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Guardar token en localStorage
      localStorage.setItem('patientToken', data.token);
      
      // Llamar callback de éxito con los datos de la visita
      onLoginSuccess(data.token, data.visit);
      
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Error al verificar los datos. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        documentType: 'CC',
        documentNumber: '',
        attentionCode: ''
      });
      setError('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />
          
          {/* Modal - Centrado correctamente */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light p-6 relative">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
                >
                  <X size={20} className="text-white" />
                </button>
                
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-2">Consultar Resultados</h2>
                  <p className="text-white/90 text-sm">
                    Ingrese sus datos y el código de atención proporcionado
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Tipo de documento */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CreditCard size={16} />
                    Tipo de Documento
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Número de documento */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User size={16} />
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Ingrese su número de documento"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {/* Código de atención */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Key size={16} />
                    Código de Atención
                  </label>
                  <input
                    type="text"
                    name="attentionCode"
                    value={formData.attentionCode}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Código de 8 dígitos"
                    maxLength="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biolab-turquoise focus:border-transparent transition-all uppercase disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El código fue proporcionado en el momento de su atención
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Verificando...
                      </span>
                    ) : (
                      'Consultar Resultados'
                    )}
                  </button>
                </div>
              </form>

              {/* Footer informativo */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <p className="text-xs text-gray-600 text-center">
                  <strong>Importante:</strong> Los resultados estarán disponibles por 30 días después de su atención. 
                  Si tiene problemas para acceder, contáctenos al 318 123 4567.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PatientLoginModal;