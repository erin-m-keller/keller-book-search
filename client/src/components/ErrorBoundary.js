import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.error("componentDidCatch error: " + error);
    console.log("componentDidCatch info: " + JSON.stringify(info));
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    // Render the wrapped components normally
    return this.props.children;
  }
}

export default ErrorBoundary;