import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo?: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;
  declare state: State;
  declare setState: any;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, errorInfo: String(error) };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('Game ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="text-5xl mb-4">🏴‍☠️</div>
          <h2 className="text-xl font-mono font-black text-amber-400 mb-2 uppercase tracking-wider">
            ¡Aventura Reconectada!
          </h2>
          <p className="text-xs text-slate-400 mb-4 max-w-md font-mono">
            Un ajuste gráfico fue detectado. Haz clic abajo para volver al juego al instante.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 text-slate-950 font-mono font-black text-xs uppercase tracking-widest cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            🏴‍☠️ Continuar Jugando
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
