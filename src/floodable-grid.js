
export default class FloodableGrid {
  constructor(data) {
    this.rows = data;
    this.height = this.rows.length;
    this.width  = this.rows[0].length;
  }

  getData() { return this.rows; }

  getVal(x, y) { return this.rows[y][x]; }

  floodOverwrite(x, y, value) {
    this.findConnectedSquares(x, y).forEach(p => this.rows[p.y][p.x] = value);
  }

  isUniform() {
    var isUniform = true;
    var firstValue = this.getVal(0, 0);
    this.rows.forEach(row => {
      row.forEach(val => {
        if (val !== firstValue) { isUniform = false; }
      });
    });
    return isUniform;
  }

  findConnectedSquares(startX, startY) {
    this.seenPoints = {};
    var squares = this._findConnectedSquares(startX, startY);
    this.seenPoints = null;
    return squares.concat({ x: startX, y: startY });
  }

  _findConnectedSquares(x, y) {
    this.seenPoints[this.pointToStr({ x, y })] = true;
    var targetValue = this.getVal(x, y);

    return this.getNeighbors(x, y).reduce((matches, point)=> {
      var currentValue = this.getVal(point.x, point.y);
      var key = this.pointToStr(point);
      var isNewMatch = currentValue === targetValue && !(key in this.seenPoints);
      if (isNewMatch) {
        this.seenPoints[key] = true;
        return matches.concat([point], this._findConnectedSquares(point.x, point.y));
      }
      return matches;
    }, []);
  }

  getNeighbors(x, y) {
    return [
      { x: x - 1, y }, { x, y: y - 1 },
      { x: x + 1, y }, { x, y: y + 1 },
    ].filter(p => this.isPointValid(p));
  }

  isPointValid(point) {
    return (
      0 <= point.x && point.x < this.width &&
      0 <= point.y && point.y < this.height
    );
  }

  pointToStr({ x, y }) { return `${x},${y}`; }
};
