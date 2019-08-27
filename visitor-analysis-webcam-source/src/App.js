import React, { Component } from 'react';
import './App.css';
import LiveDetection from './components/LiveDetection'

class App extends Component {
  render() {
    return (
      <div className="App">
        <LiveDetection />
      </div>
    );
  }
}

export default App;
