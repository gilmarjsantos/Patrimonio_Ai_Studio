
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScannerPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    // In a real app, a barcode scanning library would decode the stream.
    // Here, we simulate finding a barcode and redirecting.
    const MOCK_BARCODE = '00055789'; 
    setTimeout(() => {
      alert(`Código "${MOCK_BARCODE}" lido com sucesso! Redirecionando...`);
      navigate(`/assets/${MOCK_BARCODE}`);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Leitor de Código de Barras</h2>
        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border-4 border-gray-300">
          {error ? (
            <div className="flex items-center justify-center h-full text-red-500 p-4">{error}</div>
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
           <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-1/3 border-4 border-red-500 rounded-lg opacity-75 animate-pulse" />
           </div>
        </div>
        <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Aponte a câmera para o código de barras da etiqueta.</p>
            <button 
                onClick={handleSimulateScan}
                disabled={isScanning || !!error}
                className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center mx-auto"
            >
                {isScanning ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Lendo...
                    </>
                ) : 'Simular Leitura'}
            </button>
             <p className="text-xs text-gray-400 mt-2">(Esta funcionalidade simula a leitura do código '00055789')</p>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
