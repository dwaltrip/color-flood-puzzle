
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
    var targetVal = this.getVal(startX, startY);
    var start = { x: startX, y: startY };
    var seenPoints = { [this.pointToStr[start]]: start }
    var stack = [start];

    while (stack.length > 0) {
      var next = stack.pop();
      this.getNeighbors(next.x, next.y).forEach(point => {
        var val = this.getVal(point.x, point.y);
        var key = this.pointToStr(point);
        if (val === targetVal && !(key in seenPoints)) {
          seenPoints[key] = point;
          stack.push(point);
        }
      });
    }

    return Object.keys(seenPoints).map(key => seenPoints[key]);
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
