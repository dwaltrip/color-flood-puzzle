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
      <div className='grid-container'>
        {this.props.grid.map(row =>
          <div className='grid-row'>
            {row.map(color => (
              <div className={`grid-square ${color}-square`}/>
            ))}
          </div>
        )}
      </div>
    );
  }
}

class Game extends Component {
  constructor() {
    super();
    this.defaultSize = { width: 20, height: 15 };
    this.colors = ['green', 'blue', 'orange', 'red', 'yellow', 'purple'];
    this.setupGrid();
  }
  getRandomColor() {
    var index = randomInt(0, this.colors.length);
    return this.colors[index];
  }
  setupGrid() {
    var { width, height } = this.defaultSize;
    this.state = {
      grid: range(height, ()=> range(width, ()=> this.getRandomColor()))
    };
  }
  render() {
    return (
      <div className='game-container'>
        <ColorPicker />
        <Grid grid={this.state.grid}/>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className='app-container'>
        <div className='header'>
          <div className='header-text'>Color Flood</div>
          <div className='buttons'>
            <button>New Game</button>
          </div>
        </div>

        <Game />
      </div>
    );
  }
}

export default App;

function range(size, valueOrFn) {
  var fn = typeof valueOrFn === 'function' ? valueOrFn : (()=> valueOrFn);
  return Array.apply(null, Array(size)).map((_, i)=> fn(i));
}

function randomInt(min, max) {
  return min + Math.round(Math.random() * (max - 1 - min));
}
