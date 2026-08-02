'use client';

import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-xl text-center">
          <h2 className="text-headline-sm">Something went wrong</h2>
          <p className="text-body-sm text-on-surface-variant">
            Please refresh the page and try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
