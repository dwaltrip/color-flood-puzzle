import React, { Component } from 'react';
import './App.css';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='color-picker'></div>
    );
  }
}

class Grid extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className='grid-container'></div>
    );
  }
}

class Game extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className='game'>
        <ColorPicker />
        <Grid />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className='app-container'>
        <div className='header'>Color Flood</div>
        <Game />
      </div>
    );
  }
}

export default App;
