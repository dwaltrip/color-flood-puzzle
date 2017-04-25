import React, { Component } from 'react';
import './App.css';

import Store from './localstorage-store';
import Grid from './floodable-grid';

class ColorPicker extends Component {
  render() {
    var colorOptions = this.props.colors.map((color, i) => {
      return <div
        className={`color-option ${color}-bg`}
        onClick={()=> this.props.onSelect(color)}
        key={i}
      />;
    });
    return (
      <div className='color-picker'>
        <label>Choose next flood color:</label>
        <div className='color-options'>{colorOptions}</div>
      </div>
    );
  }
}

class ColorGrid extends Component {
  render() {
    return (
      <div className='grid-container'>
        {this.props.grid.map((row, y) =>
          <div className='grid-row' key={y}>
            {row.map((color, x) => (
              <div className={`grid-square ${color}-bg`} key={x}/>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const COLORS = ['green', 'blue', 'orange', 'red', 'yellow', 'purple'];
const randomColor = ()=> COLORS[randomInt(0, COLORS.length)];

const DEFAULT_SIZE = { width: 12, height: 12 };
const GAME_ACTIVE = 'GAME_ACTIVE';
const GAME_OVER   = 'GAME_OVER';

class Game extends Component {
  constructor() {
    super();
    this.initializeState();

    this.onNewGameClick = this.onNewGameClick.bind(this);
    this.handleColorSelection = this.handleColorSelection.bind(this);
  }

  initializeState() {
    var savedState = Store.get('game-state', this.state)
    var initialState = savedState || this.stateForNewGame();

    this.grid = new Grid(initialState.colorData);
    this.state = initialState;
    Store.set('game-state', this.state);
  }

  updateState(newState) {
    this.setState(newState, ()=> Store.set('game-state', this.state));
  }

  handleColorSelection(colorToFlood) {
    this.grid.floodOverwrite(0, 0, colorToFlood);
    this.updateState({
      colorData: this.grid.getData(),
      moveCount: this.state.moveCount + 1,
      status:  this.grid.isUniform() ? GAME_OVER : GAME_ACTIVE
    })
  }

  onNewGameClick() {
    var noConfirmNeeded = this.isOver() || this.state.moveCount === 0;
    if (noConfirmNeeded || window.confirm('End game and start a new one?')) {
      var newState = this.stateForNewGame();
      this.grid = new Grid(newState.colorData);
      this.updateState(newState);
    }
  }

  render() {
    return (
      <div className='game-container'>
        <div className='header'>
          <div className='header-text'>Color Flood</div>

          <div className='move-counter'>Moves: {this.state.moveCount}</div>

          <div className='buttons'>
            <button onClick={this.onNewGameClick}>New Game</button>
          </div>
        </div>

        {this.isActive() ?
          <ColorPicker colors={COLORS} onSelect={this.handleColorSelection}/> :
          <div className='game-over-message'>Congrats! You've filled the grid!</div>
        }

        <ColorGrid grid={this.state.colorData}/>
      </div>
    );
  }

  stateForNewGame() {
    var { width, height } = DEFAULT_SIZE;
    return {
      colorData: range(height, ()=> range(width, randomColor)),
      moveCount: 0,
      status: GAME_ACTIVE
    };
  }

  isActive()  { return this.state.status === GAME_ACTIVE; }
  isOver()    { return this.state.status === GAME_OVER;   }
}

class App extends Component {
  render() {
    return <Game />;
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
