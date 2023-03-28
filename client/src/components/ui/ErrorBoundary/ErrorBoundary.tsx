import { Component, ErrorInfo, ReactNode } from 'react';
import Container from '../Container';
import Heading from '../Heading';
import Line from '../Line';
import MutedText from '../MutedText';

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <>
          <Container>
            <Heading size='large'>
              <h1>Oops... Looks like some part of Chirper exploded 💥</h1>
            </Heading>
            <p>Check console for detailed error message</p>
          </Container>
          <Line />
          <Container>
            <MutedText>
              <p>{this.state.error && this.state.error.toString()}</p>
            </MutedText>
          </Container>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
