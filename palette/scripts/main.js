import { Canvas } from './canvas';
import { hex, setCurrentColor, setActiveTool, currentColor, prevColor } from './colors';

const canvas = new Canvas();
canvas.defaultFill();
const map = canvas.createMap();
let activeTool;
let started = false;

window.addEventListener('DOMContentLoaded', () => {
  activeTool = localStorage.tool || 'pencil';
  setActiveTool(activeTool);
  currentColor.value = localStorage.currColor || '#008000';
  prevColor.style.backgroundColor = localStorage.preColor || '#808080';
  const dataURL = localStorage.getItem('canvasImg');
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    canvas.ctx.drawImage(img, 0, 0);
  };
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('tool', activeTool);
  localStorage.setItem('currColor', currentColor.value);
  localStorage.setItem('preColor', hex(prevColor.style.backgroundColor));
  localStorage.setItem('canvasImg', canvas.canvas.toDataURL());
});

document.getElementById('tools').addEventListener('click', (event) => {
  document.getElementById('tools').querySelectorAll('p').forEach((item) => (item.classList.toggle('active-tool', false)));
  event.target.classList.toggle('active-tool');
  const classList = event.target.classList;
  const [, toolName, ] = classList;
  activeTool = toolName;
  if (activeTool === 'picker') {
    document.getElementById('colors').querySelectorAll('p').forEach((item) => (item.classList.toggle('active-colors', true)));
  } else {
    document.getElementById('colors').querySelectorAll('p').forEach((item) => (item.classList.toggle('active-colors', false)));
  }
});

document.getElementById('canvas').addEventListener('mousedown', (e) => {
  const coordinates = canvas.getMousePos(e);
  const sector = canvas.findCanvasSector(map, coordinates.x, coordinates.y);
  switch (activeTool) {
    case 'bucket':
      canvas.fillSector(map[sector[0]][sector[1]].x,
        map[sector[0]][sector[1]].y,
        currentColor.value);
      break;
    case 'picker':
      setCurrentColor(canvas.colorOfCanvasPixel(coordinates.x, coordinates.y));
      break;
    case 'pencil':
      canvas.ctx.beginPath();
      canvas.ctx.moveTo(coordinates.x, coordinates.y);
      started = true;
      document.getElementById('canvas').addEventListener('mousemove', (evt) => {
        if (started) {
          const coord = canvas.getMousePos(evt);
          canvas.ctx.strokeStyle = currentColor.value;
          canvas.ctx.lineTo(coord.x, coord.y);
          canvas.ctx.stroke();
        }
      });
      document.getElementById('canvas').addEventListener('mouseup', () => {
        if (started) {
          canvas.ctx.closePath();
          started = false;
        }
      });
      break;
    default:
      break;
  }
});

document.getElementById('colors').addEventListener('click', (event) => {
  if (activeTool === 'picker') {
    if (event.target.id === 'current-color') {
      prevColor.style.backgroundColor = currentColor.value;
    }
    switch (event.target.classList[1]) {
      case 'second':
        setCurrentColor(hex(prevColor.style.backgroundColor));
        break;
      case 'third':
        setCurrentColor('#CD0000');
        break;
      case 'fourth':
        setCurrentColor('#0000ff');
        break;
      default:
        break;
    }
  } else if (activeTool !== 'picker' && event.target.id === 'current-color') {
    event.preventDefault();
  }
});

document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 66:
      activeTool = 'bucket';
      setActiveTool(activeTool);
      break;
    case 67:
      activeTool = 'picker';
      setActiveTool(activeTool);
      break;
    case 80:
      activeTool = 'pencil';
      setActiveTool(activeTool);
      break;
    default:
      break;
  }
});

export { currentColor, prevColor };
