// import necessary dependencies
import React, { Component } from 'react';
// define a class-based component ErrorBoundary
class ErrorBoundary extends Component {

  constructor(props) {
    super(props);
    // set initial state with hasError flag as false
    this.state = { hasError: false };
  }

  // invoked when an error is thrown during rendering, 
  // in lifecycle methods, or in the constructors of 
  // any child component
  componentDidCatch(error, info) {
    // error handling method called when an error is caught in the component tree
    console.error("componentDidCatch error: " + error);
    console.info("componentDidCatch info: " + JSON.stringify(info));
    // update state to indicate that an error has occurred
    this.setState({ hasError: true });
  }
  
  // render the content
  render() {
    // check if an error has occurred
    if (this.state.hasError) {
      // render an error message if an error has occurred
      return <h1>Something went wrong.</h1>;
    }
    // render the wrapped components normally if no error has occurred
    return this.props.children;
  }
}
// export the ErrorBoundary component 
export default ErrorBoundary;