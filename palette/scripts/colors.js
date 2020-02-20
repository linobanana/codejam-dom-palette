const currentColor = document.getElementById('current-color');
const prevColor = document.querySelector('.prevColor');

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw new Error('Invalid color component');
  }
  return ((r << 16) | (g << 8) | b).toString(16);
}

function hex(rgbString) {
  const arr = rgbString.split(',');
  const r = Number(arr[0].substring(4));
  const g = Number(arr[1]);
  const b = Number(arr[2].slice(1, -1));
  return '#' + ('000000' + rgbToHex(r, g, b)).slice(-6);
}

function setCurrentColor(newColorInHex) {
  prevColor.style.backgroundColor = currentColor.value;
  currentColor.value = newColorInHex;
}

function setActiveTool(name) {
  document.getElementById('tools').querySelectorAll('p').forEach((item) => (item.classList.toggle('active-tool', false)));
  document.querySelector(`.${name}`).classList.toggle('active-tool');
  if (name === 'picker') {
    document.getElementById('colors').querySelectorAll('p').forEach((item) => (item.classList.toggle('active-colors', true)));
  } else {
    document.getElementById('colors').querySelectorAll('p').forEach((item) => (item.classList.toggle('active-colors', false)));
  }
}

export {
  rgbToHex, hex, setCurrentColor, setActiveTool, currentColor, prevColor,
};
