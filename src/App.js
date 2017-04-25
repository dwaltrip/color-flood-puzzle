import React, { Component } from 'react';
import './App.css';

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

class Grid extends Component {
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
    this.state = this.stateForNewGame();

    this.onNewGameClick = this.onNewGameClick.bind(this);
    this.handleColorSelection = this.handleColorSelection.bind(this);
  }

  handleColorSelection(colorToFlood) {
    var grid = this.state.grid;
    var points = findConnectedSquares(grid, 0, 0);
    points.forEach(point => {
      var [x, y] = point;
      grid[y][x] = colorToFlood;
    });
    grid[0][0] = colorToFlood;

    var isOneColor = Object.keys(grid.reduce((memo, row)=> {
      row.forEach(color => memo[color] = true);
      return memo;
    }, {})).length === 1;

    this.setState({
      grid,
      moveCount: this.state.moveCount + 1,
      status:  isOneColor ? GAME_OVER : GAME_ACTIVE
    });
  }

  onNewGameClick() {
    if (this.isOver() || window.confirm('End this game and start a new one?')) {
      this.setState(this.stateForNewGame());
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
          <ColorPicker
            colors={COLORS}
            onSelect={this.handleColorSelection}
          /> :
          <div className='game-over-message'>
            Congrats! You've filled the grid!
          </div>
        }

        <Grid grid={this.state.grid}/>
      </div>
    );
  }

  stateForNewGame() {
    var { width, height } = DEFAULT_SIZE;
    var grid = range(height, ()=> range(width, randomColor));
    return { grid, moveCount: 0, status: GAME_ACTIVE };
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

function findConnectedSquares(grid, startX, startY) {
  var targetValue = grid[startY][startX];

  var startKey = `${startX},${startY}`;
  var seenPoints = { [startKey]: true };

  function getMatchingNeighbors(currentX, currentY) {
    return neighboringPoints(grid, currentX, currentY).reduce((matches, point) => {
      var [x, y] = point;
      var key = point.join(',');

      var isNewMatch = grid[y][x] === targetValue && !(key in seenPoints);
      if (isNewMatch) {
        seenPoints[key] = true;
        return matches.concat([point], getMatchingNeighbors(x, y));
      }
      return matches;
    }, []);
  }

  return getMatchingNeighbors(startX, startY);
}

function neighboringPoints(grid, x, y) {
  var width  = grid[0].length;
  var height = grid.length;
  return [
    [x - 1, y], [x, y - 1],
    [x + 1, y], [x, y + 1],
  ].filter(p => (
    p[0] >= 0 && p[0] < width &&
    p[1] >= 0 && p[1] < height
  ));
}

function range(size, valueOrFn) {
  var fn = typeof valueOrFn === 'function' ? valueOrFn : (()=> valueOrFn);
  return Array.apply(null, Array(size)).map((_, i)=> fn(i));
}

function randomInt(min, max) {
  return min + Math.round(Math.random() * (max - 1 - min));
}
