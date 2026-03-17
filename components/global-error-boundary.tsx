'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Suppress browser extension errors
    const errorMessage = error.message || '';
    const isBrowserExtension = 
      errorMessage.includes('lockdown') ||
      errorMessage.includes('script.js') ||
      errorMessage.includes('SES') ||
      errorMessage.includes('Removing unpermitted');

    if (isBrowserExtension) {
      console.warn('[Extension Error - Suppressed]', errorMessage);
      return { hasError: false, error: null };
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorMessage = error.message || '';
    const isBrowserExtension = 
      errorMessage.includes('lockdown') ||
      errorMessage.includes('script.js') ||
      errorMessage.includes('SES');

    if (!isBrowserExtension) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Also add a global error handler for runtime errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || '';
    const isBrowserExtension = 
      errorMessage.includes('lockdown') ||
      errorMessage.includes('script.js') ||
      errorMessage.includes('SES') ||
      errorMessage.includes('Removing unpermitted');

    if (isBrowserExtension) {
      // Prevent default error logging for extension errors
      event.preventDefault();
      console.warn('[Browser Extension Error - Suppressed]', errorMessage);
    }
  });

  // Also suppress unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason?.message || String(event.reason) || '';
    const isBrowserExtension = 
      errorMessage.includes('lockdown') ||
      errorMessage.includes('script.js') ||
      errorMessage.includes('SES');

    if (isBrowserExtension) {
      event.preventDefault();
      console.warn('[Browser Extension Error - Suppressed]', errorMessage);
    }
  });
}
