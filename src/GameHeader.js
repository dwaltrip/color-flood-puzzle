import React, { Component } from 'react';

const MIN_SIZE     = { width: 5,  height: 5 };
const MAX_SIZE     = { width: 80, height: 60 };

export default class GameHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingSize: false,
      ...props.gridSize
    };
    this.startEditingSize = this.startEditingSize.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.validateSize = this.validateSize.bind(this);
    this.cancelEditingSize = this.cancelEditingSize.bind(this);
    this.commitSizeChanges = this.commitSizeChanges.bind(this);
  }

  startEditingSize() { this.setState({ isEditingSize: true }); }

  updateWidth(e)  { this.setState({ width:  parseInt(e.target.value) }); }
  updateHeight(e) { this.setState({ height: parseInt(e.target.value) }); }

  validateSize()  {
    this.setState({
      width:  constrain(this.state.width,   MIN_SIZE.width,   MAX_SIZE.width),
      height: constrain(this.state.height,  MIN_SIZE.height,  MAX_SIZE.height)
    })
  }

  cancelEditingSize() {
    this.resetSize();
    this.setState({ isEditingSize: false });
  }

  commitSizeChanges() {
    var newSize = { width: this.state.width, height: this.state.height };
    this.props.requestGridSizeChange(newSize, {
      onConfirm:  ()=> this.setState({ isEditingSize: false }),
      onCancel:   ()=> this.resetSize()
    });
  }

  resetSize() {
    this.setState({ ...this.props.gridSize });
  }

  hasModifiedSizeInputs() {
    return !(
      this.state.width  === this.props.gridSize.width &&
      this.state.height === this.props.gridSize.height
    );
  }

  render() {
    return (
      <div className='header'>
        <div className='header-section header-text'>Color Flood</div>

        {!this.state.isEditingSize && (
          <div className='header-section move-counter'>Moves: {this.props.moveCount}</div>
        )}

        <div className='header-section'>
          {this.state.isEditingSize ? (
            <div className='grid-size-editor'>
              <div>Width</div>
              <input type='number'value={this.state.width}  onChange={this.updateWidth}  onBlur={this.validateSize} />

              <div>Height</div>
              <input type='number'value={this.state.height} onChange={this.updateHeight} onBlur={this.validateSize} />

              <button onClick={this.cancelEditingSize}> Cancel </button>
              <button onClick={this.commitSizeChanges} disabled={!this.hasModifiedSizeInputs()} > Save </button>
            </div>
          ) : (
            <div className='grid-size-input' onClick={this.startEditingSize}>
              {this.state.width} x {this.state.height}
            </div>
          )}
        </div>

        {!this.state.isEditingSize && (
          <div className='header-section buttons'>
            <button onClick={this.props.onNewGameClick}>New Game</button>
          </div>
        )}
      </div>
    );
  }
}

function constrain(num, min, max) {
  return num < min ? min : (num > max ? max : num);
}
