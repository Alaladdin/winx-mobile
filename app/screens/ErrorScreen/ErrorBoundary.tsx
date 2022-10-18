import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorDetails } from './ErrorDetails';
import { reportCrash } from '@/utils/crash-reporting';

interface Props {
  children: ReactNode
  catchErrors: 'always' | 'dev' | 'prod' | 'never'
}

interface State {
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * This component handles whenever the user encounters a JS error in the
 * app. It follows the "error boundary" pattern in React. We're using a
 * class component because according to the documentation, only class
 * components can be error boundaries.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Error-Boundary.md)
 * - [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
 */
export class ErrorBoundary extends Component<Props, State> {
  state = { error: null, errorInfo: null };

  // To avoid unnecessary re-renders
  shouldComponentUpdate(nextProps: Readonly<any>, nextState: Readonly<any>): boolean {
    return nextState.error !== nextProps.error;
  }

  // If an error in a child is encountered, this will run
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });

    reportCrash(error);
  }

  // Reset the error back to null
  resetError = () => {
    this.setState({ error: null, errorInfo: null });
  };

  // Only enable if we're catching errors in the right environment
  isEnabled(): boolean {
    const { catchErrors } = this.props;

    return (
      catchErrors === 'always'
      || (catchErrors === 'dev' && __DEV__)
      || (catchErrors === 'prod' && !__DEV__)
    );
  }

  // Render an error UI if there's an error; otherwise, render children
  render() {
    const { children } = this.props;
    const { error, errorInfo } = this.state;

    return this.isEnabled() && error ? (
      <ErrorDetails
        error={ error }
        errorInfo={ errorInfo }
        onReset={ this.resetError }
      />
    ) : (
      children
    );
  }
}
