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

  defaultFill() {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.height, this.canvas.width);
  }

  getClickPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {
      x: x,
      y: y,
    };
  }

  findCanvasSector(map, x, y) {
    let axisX;
    let axisY;
    for (let i = 0; i < 1; i += 1) {
      for (let j = 0; j < this.numberOfLevels; j += 1) {
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
    for (let i = 0; i < this.numberOfLevels; i += 1) {
      for (let j = axisX; j < axisX + 1; j += 1) {
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

  colorOfCanvasPixel(x, y) {
    let data = this.ctx.getImageData(x, y, 1, 1).data;
    return "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6);
  }
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

function hex(rgbString) {
  const arr = rgbString.split(',');
  const r = Number(arr[0].substring(4));
  const g = Number(arr[1]);
  const b = Number(arr[2].slice(1, -1));
  return "#" + ("000000" + rgbToHex(r, g, b)).slice(-6);
}

const canvas = new Canvas(128);
canvas.defaultFill();
const map = canvas.createMap();
let activeTool;
let currentColor = document.getElementById('current-color');
let prevColor = document.querySelector('.prevColor');

function setCurrentColor(newColorInHex) {
  prevColor.style.backgroundColor = currentColor.value;
  currentColor.value = newColorInHex;
}

document.getElementById('tools').addEventListener('click', () => {
  document.getElementById('tools').querySelectorAll('p').forEach(item => item.classList.toggle('active-tool', false));
  event.target.classList.toggle('active-tool');
  activeTool = event.target.classList[1];
  if (activeTool === 'picker') {
    document.getElementById('colors').querySelectorAll('p').forEach(item => item.classList.toggle('active-colors', true));
  } else {
    document.getElementById('colors').querySelectorAll('p').forEach(item => item.classList.toggle('active-colors', false));
  }
});

document.getElementById('canvas').addEventListener('click', (e) => {
  let coordinates = canvas.getClickPosition(e);
  if (activeTool === 'bucket') {
    let sector = canvas.findCanvasSector(map, coordinates.x, coordinates.y);
    canvas.fillSector(map[sector[0]][sector[1]].x, map[sector[0]][sector[1]].y, currentColor.value);
  }
  if (activeTool === 'picker') {
    setCurrentColor(canvas.colorOfCanvasPixel(coordinates.x, coordinates.y));
  }
});

document.getElementById('colors').addEventListener('click', (event) => {
  if (activeTool === 'picker') {
    if (event.target.id === 'current-color') {
      prevColor.style.backgroundColor = currentColor.value;
    } else if (event.target.classList[1] === 'second') {
      setCurrentColor(hex(prevColor.style.backgroundColor));
    } else if (event.target.classList[1] === 'third') {
      setCurrentColor('#CD0000');
    } else if (event.target.classList[1] === 'fourth') {
      setCurrentColor('#0000ff');
    }
  } else if (activeTool !== 'picker' && event.target.id === 'current-color') {
    event.preventDefault();
  }
});
