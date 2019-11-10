import { rgbToHex } from './colors.js';

class Canvas {
  constructor(cellSize = 128) {
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

  defaultFill() {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.height, this.canvas.width);
  }

  findCanvasSector(map, x, y) {
    let axisX;
    let axisY;
    for (let i = 0; i < 1; i += 1) {
      for (let j = 0; j < this.numberOfLevels; j += 1) {
        if (x > 512) { return; }
        if (map[i][j + 1] === undefined && x > map[i][j].x) {
          axisX = j;
        } else if (x > map[i][j].x && x < map[i][j + 1].x) {
          axisX = j;
        }
      }
    }
    for (let i = 0; i < this.numberOfLevels; i += 1) {
      for (let j = axisX; j < axisX + 1; j += 1) {
        if (y > 512) { return; }
        if (map[i + 1] === undefined && y > map[i][j].y) {
          axisY = i;
        } else if (y > map[i][j].y && y < map[i + 1][j].y) {
          axisY = i;
        }
      }
    }
    return [axisY, axisX];
  }

  fillSector(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
  }

  colorOfCanvasPixel(x, y) {
    const data = this.ctx.getImageData(x, y, 1, 1).data;
    return '#' + ('000000' + rgbToHex(data[0], data[1], data[2])).slice(-6);
  }

  getMousePos(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }
}

export { Canvas };
