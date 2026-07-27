import React, { useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.message?.includes('removeChild') || event.message?.includes('circle')) {
        console.warn('Suppressed DOM removeChild warning:', event.error);
        event.preventDefault();
      }
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="text-5xl mb-4">🏴‍☠️</div>
        <h2 className="text-xl font-mono font-black text-amber-400 mb-2 uppercase">
          ¡Reconexión de Emergencia!
        </h2>
        <button
          onClick={() => {
            setHasError(false);
            window.location.reload();
          }}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-widest cursor-pointer shadow-lg active:scale-95"
        >
          🔄 Continuar Jugando
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
