import React, { Component, PureComponent } from 'react';
import './game.css';

import Store from './local-storage-store';
import Grid from './floodable-grid';

import GameHeader from './game-header';

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
        <label>Choose color:</label>
        <div className='color-options'>{colorOptions}</div>
      </div>
    );
  }
}

class ColorSquare extends PureComponent {
  render() {
    var borderInfo = this.props.borderInfo || {};
    var isActive = borderInfo.showRight || borderInfo.showBottom;
    var className = [
      'grid-square',
      `${this.props.color}-bg`,
      isActive ? 'is-active' : '',
      borderInfo.showRight  ? 'active-right'  : '',
      borderInfo.showBottom ? 'active-bottom' : ''
    ].join(' ');
    return <div className={className} />
  }
}

class ColorGrid extends Component {
  render() {
    return (
      <div className='grid-container'>
        {this.props.grid.map((row, y) =>
          <div className='grid-row' key={y}>
            {row.map((color, x) => {
              var borderInfo = this.props.getBorderInfo(x, y);
              return <ColorSquare color={color} borderInfo={borderInfo} key={x} />
            })}
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

export default class Game extends Component {
  constructor() {
    super();
    this.initializeState();

    this.onNewGameClick = this.onNewGameClick.bind(this);
    this.handleColorSelection = this.handleColorSelection.bind(this);
    this.requestGridSizeChange = this.requestGridSizeChange.bind(this);
  }

  initializeState() {
    var savedState = Store.get('game-state', this.state)
    var initialState = savedState || this.stateForNewGame(DEFAULT_SIZE);

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
      var newState = this.stateForNewGame(this.state.gridSize);
      this.grid = new Grid(newState.colorData);
      this.updateState(newState);
    }
  }

  requestGridSizeChange(newSize, { onConfirm, onCancel }={}) {
    var noConfirmNeeded = this.isOver() || this.state.moveCount === 0;
    if (noConfirmNeeded || window.confirm('Change grid size and start a new game?')) {
      var newState = this.stateForNewGame(newSize);
      this.grid = new Grid(newState.colorData);
      this.updateState(newState);
      onConfirm && onConfirm();
    } else {
      onCancel && onCancel();
    }
  }

  getBorderInfoLookup() {
    var grid = this.grid;
    var squares = grid.findConnectedSquares(0, 0);
    var getVal = (x, y) => grid.isPointValid({ x, y }) ? grid.getVal(x, y) : null;

    return squares.reduce((memo, point) => {
      var val = grid.getVal(point.x, point.y);
      memo[grid.pointToStr(point)] = {
        showBottom: getVal(point.x,     point.y + 1) === val,
        showRight:  getVal(point.x + 1, point.y    ) === val,
      }
      return memo;
    }, {});
  }

  render() {
    var borderInfoLookup = this.getBorderInfoLookup();
    var getBorderInfo = (x, y) => {
      var key = this.grid.pointToStr({ x, y });
      return (key in borderInfoLookup) ? borderInfoLookup[key] : null;
    };

    return (
      <div className='game-container'>
        <GameHeader
          gridSize={this.state.gridSize}
          moveCount={this.state.moveCount}
          requestGridSizeChange={this.requestGridSizeChange}
          onNewGameClick={this.onNewGameClick}
        />

        {this.isActive() ?
          <ColorPicker colors={COLORS} onSelect={this.handleColorSelection}/> :
          <div className='game-over-message'>Congrats! You've filled the grid!</div>
        }

        <ColorGrid grid={this.state.colorData} getBorderInfo={getBorderInfo}/>
      </div>
    );
  }

  stateForNewGame({ width, height }=DEFAULT_SIZE) {
    return {
      colorData: range(height, ()=> range(width, randomColor)),
      moveCount: 0,
      status: GAME_ACTIVE,
      gridSize: { width, height }
    };
  }

  isActive()  { return this.state.status === GAME_ACTIVE; }
  isOver()    { return this.state.status === GAME_OVER;   }
}

function range(size, valueOrFn) {
  var fn = typeof valueOrFn === 'function' ? valueOrFn : (()=> valueOrFn);
  return Array.apply(null, Array(size)).map((_, i)=> fn(i));
}

function randomInt(min, max) {
  return min + Math.round(Math.random() * (max - 1 - min));
}
