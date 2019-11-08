class Canvas {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.canvas = document.getElementById('canvas');
    this.numberOfLevels = this.canvas.width / this.cellSize;
    this.ctx = this.canvas.getContext('2d');
  }

  createMap() {
    const canvasSize = this.canvas.width;
    const result = new Array(this.numberOfLevels);

    for (let i = 0; i < result.length; i += 1) {
      result[i] = new Array(this.numberOfLevels);
    }
    for (let i = 0; i < result.length; i += 1) {
      for (let j = 0; j < result.length; j += 1) {
        result[i][j] = {};
      }
    }
    for (let i = 0; i < canvasSize; i += this.cellSize) {
      for (let j = 0; j < canvasSize; j += this.cellSize) {
        result[i / this.cellSize][j / this.cellSize].x = j;
        result[i / this.cellSize][j / this.cellSize].y = i;
      }
    }
    return result;
  }

  getClickPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; 
    const y = event.clientY - rect.top;
    return {x: x, y: y};
  }

  findCanvasSector(map, x, y) {
    let axisX;
    let axisY;
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < this.numberOfLevels; j++) {
        if (x > 512) {
          return;
        } else {
          if (map[i][j + 1] === undefined && x > map[i][j].x) {
            axisX = j;
          } else if (x > map[i][j].x && x < map[i][j + 1].x) {
            axisX = j;
          }
        }
      }
    }
    for (let i = 0; i < this.numberOfLevels; i++) {
      for (let j = axisX; j < axisX + 1; j++) {
        if (y > 512) {
          return;
        } else {
          if (map[i + 1] === undefined && y > map[i][j].y) {
            axisY = i;
          } else if (y > map[i][j].y && y < map[i + 1][j].y) {
            axisY = i;
          }
        }
      }
    }
    return [axisY, axisX];
  }

  fillSector(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
  }
}

const canvas = new Canvas(128);
const map = canvas.createMap();

canvas.canvas.addEventListener('mousedown', function(e) {
  let a = canvas.getClickPosition(e);
  let j = canvas.findCanvasSector(map, a.x, a.y);
  let k = canvas.fillSector(map[j[0]][j[1]].x, map[j[0]][j[1]].y, '#000');
});

let currentColor = window.getComputedStyle(document.querySelector('.currentColor')).backgroundColor;
console.log(currentColor);
