import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
          <div className="glass-card flex flex-col items-center gap-5 px-10 py-9 text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <AlertTriangle size={22} />
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <p
                className="text-sm font-display font-bold tracking-tight"
                style={{ color: '#0f172a' }}
              >
                Something went wrong
              </p>
              <p className="text-[13px] text-black/50 leading-relaxed">
                We hit an unexpected error. Please refresh the page to continue.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReload}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <RefreshCw size={14} />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
