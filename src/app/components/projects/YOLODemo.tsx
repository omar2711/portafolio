import React, { useState, useRef } from 'react';

const YOLODemo: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const detectObjects = async (imageFile: File) => {
    setProcessing(true);
    setError(null);
    setResultImage(null);

    if (!API_BASE_URL || !API_KEY) {
      setError('API no configurada.');
      setProcessing(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch(`${API_BASE_URL}/predict-image`, {
        method: 'POST',
        headers: {
          'X-API-Key': API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 403) {
          throw new Error('API key inválida o acceso denegado');
        } else if (response.status === 429) {
          throw new Error('Límite de requests excedido. Intenta más tarde.');
        } else if (response.status === 413) {
          throw new Error('Imagen demasiado grande. Máximo 10MB.');
        } else {
          throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setResultImage(imageUrl);
      
    } catch (error) {
      console.error('Error calling detection API:', error);
      setError(`${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 10MB.');
      return;
    }

    console.log("File selected:", file.name, file.size);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    await detectObjects(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const clearResults = () => {
    setResultImage(null);
    setOriginalImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!API_BASE_URL || !API_KEY) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-white p-4">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold mb-2">API Configuration Missing</h3>
          <p className="text-sm opacity-75 mb-4">
            Environment variables not configured.<br/>
            Contact administrator to enable AI detection.
          </p>
          <div className="text-xs opacity-50 bg-gray-900 p-2 rounded">
            Missing: NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_KEY
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 flex-1 min-h-0">
        
        <div
          className={`border-2 border-dashed rounded-lg p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 
          h-40 sm:h-48 lg:h-full order-1 lg:order-1
          ${dragActive 
            ? 'border-red-400 bg-red-400 bg-opacity-10' 
            : 'border-gray-400 hover:border-red-400'
          } ${processing ? 'pointer-events-none opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !processing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            disabled={processing}
          />
          
          <div className="text-center text-white max-w-xs sm:max-w-sm">
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 border-b-2 border-red-400 mx-auto mb-2 sm:mb-3"></div>
                <h4 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">Processing...</h4>
                <p className="text-xs opacity-75">AI analyzing with secure API</p>
              </>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">🔥</div>
                <h4 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">Fire Detection</h4>
                <p className="text-xs opacity-75 mb-2 sm:mb-3">
                  <span className="block">Drag & drop or click</span>
                  <span className="block lg:hidden">Secure AI detection</span>
                  <span className="hidden lg:block">Secure AI-powered detection via protected API</span>
                </p>
                {(resultImage || originalImage) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearResults();
                    }}
                    className="mt-2 px-2 py-1 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                  >
                    Clear
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="relative flex items-center justify-center border border-gray-600 rounded-lg overflow-hidden 
                      h-40 sm:h-48 lg:h-full order-2 lg:order-2">
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-90 text-white text-center p-2 sm:p-3 z-10">
              <div className="max-w-[200px] sm:max-w-xs">
                <p className="text-sm mb-1 sm:mb-2">❌ Error</p>
                <p className="text-xs break-words mb-2 sm:mb-3">{error}</p>
                <button
                  onClick={clearResults}
                  className="px-2 py-1 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {resultImage ? (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center p-1 sm:p-2 min-h-0">
                <img
                  src={resultImage}
                  alt="Detection Results"
                  className="max-w-full max-h-full object-contain rounded"
                  style={{ backgroundColor: '#1a1a1a' }}
                />
              </div>
              <div className="bg-green-900 bg-opacity-90 text-white p-1 sm:p-2 text-center flex-shrink-0">
                <p className="text-xs font-bold">
                  ✅ <span className="hidden sm:inline">Detection </span>Complete
                  <span className="ml-1">🔒</span>
                </p>
              </div>
            </div>
          ) : originalImage && !processing ? (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center p-1 sm:p-2 min-h-0">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-w-full max-h-full object-contain rounded opacity-50"
                  style={{ backgroundColor: '#1a1a1a' }}
                />
              </div>
              <div className="bg-yellow-900 bg-opacity-90 text-white p-1 sm:p-2 text-center flex-shrink-0">
                <p className="text-xs">⏳ Processing securely...</p>
              </div>
            </div>
          ) : (
            <div className="text-white text-center w-full h-full flex items-center justify-center">
              <div>
                <p className="text-sm sm:text-base mb-1">🖼️ Results</p>
                <p className="text-xs opacity-75">Upload to start detection</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-center text-xs text-gray-400 flex-shrink-0">
        <p className="truncate">
          {processing && <span className="ml-1">⚡ Secure API processing</span>}
          {!processing && <span className="opacity-50">🔒 Protected API endpoint</span>}
        </p>
      </div>
    </div>
  );
};

export default YOLODemo;