import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary class component to catch rendering errors and display a fallback UI.
 */
// Fix: Extending Component directly from the named import to ensure props and state are correctly inherited and typed.
class ErrorBoundary extends Component<Props, State> {
  // Initializing state in the constructor is a robust way to ensure it's correctly typed on the instance.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Apostolic Order Interrupted:', error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };

  public render(): ReactNode {
    // Destructuring state and props which are inherited from the base Component class.
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center p-6 text-center">
          <div className="max-w-2xl w-full bg-white border border-stone-200 shadow-2xl rounded-[3rem] p-12 sm:p-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#C9A24D]"></div>

            <div className="mb-12">
              <div className="w-24 h-24 bg-[#0B1C2D] text-[#C9A24D] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-[#C9A24D] uppercase tracking-[0.5em] text-[10px] font-black mb-4">
                Governance Alert
              </p>
              <h1 className="text-4xl sm:text-5xl font-black text-[#0B1C2D] mb-6 leading-tight">
                Order{' '}
                <span className="italic font-serif text-[#C9A24D]">
                  Interrupted.
                </span>
              </h1>
              <p className="text-stone-500 font-light text-lg leading-relaxed mb-10">
                The digital sanctuary has encountered an unforeseen misalignment
                in the institutional records. The Chancery has been notified of
                this interruption.
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-12 py-5 bg-[#0B1C2D] text-[#C9A24D] text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:scale-105 transition-all shadow-xl active:scale-95"
              >
                Restore Alignment
              </button>
              <p className="text-[9px] text-stone-300 uppercase tracking-widest italic font-bold">
                Error Code: {error?.name || 'MISALIGNMENT_GENERIC'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
