// src/components/ResultsViewerModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, FileText, AlertCircle, Loader2, CheckCircle, Clock } from 'lucide-react';

const ResultsViewerModal = ({ isOpen, onClose, token, visitInfo }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && token && visitInfo?.id) {
      fetchResults();
    }
  }, [isOpen, token, visitInfo]);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulación de carga de resultados - En producción esto se conectaría a un backend real
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de red

      // En modo demo, mostrar un mensaje informativo
      // En producción, aquí se cargaría el PDF real desde el servidor
      
      // Por ahora, no podemos mostrar un PDF real sin backend
      // Mostrar mensaje de demo
      setError('Sistema en modo demostración. Los resultados reales estarán disponibles cuando el sistema esté en producción.');
      
    } catch (err) {
      console.error('Error al cargar resultados:', err);
      setError('Sistema en modo demo. Para acceder a resultados reales, contacte al laboratorio.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Resultados_BIOLAB_${visitInfo.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!pdfUrl) return;
    
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  const handleClose = () => {
    // Limpiar la URL del blob cuando se cierra el modal
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setError('');
    onClose();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pendiente': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'EnProceso': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'Completado': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Entregado': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig['Pendiente'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={14} />
        {status}
      </span>
    );
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-6xl max-h-[90vh] mx-auto flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light p-6 relative flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
                
                <div className="text-white pr-10">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={24} />
                    <h2 className="text-2xl font-bold">Resultados de Laboratorio</h2>
                  </div>
                  
                  {visitInfo && (
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="font-medium">Estado:</span>
                        {getStatusBadge(visitInfo.status)}
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="font-medium">Exámenes:</span>
                        <span>{visitInfo.examTypes?.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Bar */}
              {!loading && !error && pdfUrl && (
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between flex-shrink-0">
                  <p className="text-sm text-gray-600">
                    Los resultados están listos para su visualización
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Printer size={18} />
                      Imprimir
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-biolab-turquoise to-biolab-blue-light text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                    >
                      <Download size={18} />
                      Descargar PDF
                    </button>
                  </div>
                </div>
              )}

              {/* Content Area */}
              <div className="flex-1 overflow-auto p-6">
                {loading && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                    <Loader2 size={48} className="animate-spin text-biolab-turquoise mb-4" />
                    <p className="text-gray-600">Cargando resultados...</p>
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                    <div className="bg-red-50 rounded-lg p-6 max-w-md">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                        <div>
                          <h3 className="font-semibold text-red-800 mb-2">
                            No se pudieron cargar los resultados
                          </h3>
                          <p className="text-red-600 text-sm">{error}</p>
                          <button
                            onClick={fetchResults}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Intentar nuevamente
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!loading && !error && pdfUrl && (
                  <div className="h-full min-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full"
                      title="Resultados PDF"
                      style={{ minHeight: '600px' }}
                    />
                  </div>
                )}

                {!loading && !error && !pdfUrl && visitInfo?.hasResults === false && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                    <div className="bg-blue-50 rounded-lg p-6 max-w-md text-center">
                      <Clock size={48} className="text-blue-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Resultados en proceso
                      </h3>
                      <p className="text-blue-600 text-sm">
                        Sus resultados aún están siendo procesados. Por favor, intente nuevamente más tarde.
                      </p>
                      <p className="text-blue-500 text-xs mt-3">
                        Tiempo estimado: 24-48 horas hábiles
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t flex-shrink-0">
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-600">
                    <p className="font-medium mb-1">Información importante:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Estos resultados tienen validez de 30 días desde su emisión</li>
                      <li>Para interpretación médica, consulte con su médico tratante</li>
                      <li>Si necesita soporte, contáctenos al 318 123 4567</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResultsViewerModal;