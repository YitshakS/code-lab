var emoji = '\u2B50';
const canvas = document.getElementById('canvas');
const shapeSelect = document.getElementById('shape-select');
const thicknessGroup = document.getElementById('thickness-group');
const thicknessInput = document.getElementById('thickness-input');
const rowsGroup = document.getElementById('rows-group');
const colsGroup = document.getElementById('cols-group');
const rowsInput = document.getElementById('rows-input');
const colsInput = document.getElementById('cols-input');
const styleToggle = document.getElementById('style-toggle');
const borderToggle = document.getElementById('border-toggle');
const canvasPanel = document.getElementById('canvas-panel');
const cellSizeSlider = document.getElementById('cell-size-slider');
const cellSizeValueSpan = document.getElementById('cell-size-value');
const shapeDependentControls = document.getElementById('shape-dependent-controls');
const mainContainer = document.getElementById('main-container');
const controlsPanel = document.getElementById('controls-panel');
const splitter = document.getElementById('splitter');

const darkModeToggle = document.getElementById('mode-toggle');
const body = document.body;
const emojiBtn = document.getElementById('emoji-btn');
const pickerOverlay = document.getElementById('picker-overlay');
const emojiGrid = document.getElementById('emoji-grid');

let isDragging = false;

splitter.addEventListener('mousedown', (e) => {
  isDragging = true;
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const containerRect = mainContainer.getBoundingClientRect();
  const isRtl = document.documentElement.dir === 'rtl';
  
  let newCanvasPercentage;
  let newControlsPercentage;

  if (isRtl) {
    // ב-RTL, המרחק מצד ימין הוא הקובע
    const newCanvasWidth = containerRect.right - e.clientX;
    const newControlsWidth = e.clientX - containerRect.left;
    newCanvasPercentage = (newCanvasWidth / containerRect.width) * 100;
    newControlsPercentage = (newControlsWidth / containerRect.width) * 100;
  } else {
    // ב-LTR, המרחק מצד שמאל הוא הקובע
    const newCanvasWidth = e.clientX - containerRect.left;
    const newControlsWidth = containerRect.right - e.clientX;
    newCanvasPercentage = (newCanvasWidth / containerRect.width) * 100;
    newControlsPercentage = (newControlsWidth / containerRect.width) * 100;
  }

  // כדי למנוע יחסים שליליים
  if (newCanvasPercentage < 0 || newControlsPercentage < 0) return;

  mainContainer.style.gridTemplateColumns = `${newCanvasPercentage}% 5px ${newControlsPercentage}%`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.userSelect = '';
});

shapeSelect.addEventListener('change', () => {
  updateControls();
  drawShape();
});

styleToggle.addEventListener('change', () => {
  updateControls();
  drawShape();
});

borderToggle.addEventListener('change', () => {
  if (borderToggle.checked) {
    canvasPanel.classList.add('show-border');
  } else {
    canvasPanel.classList.remove('show-border');
  }
});

darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
});

rowsInput.addEventListener('input', drawShape);
colsInput.addEventListener('input', drawShape);
thicknessInput.addEventListener('input', drawShape);

cellSizeSlider.addEventListener('input', updateCellSize);

function updateCellSize() {
  const newSize = cellSizeSlider.value;
  document.documentElement.style.setProperty('--cell-size', `${newSize}px`);
  cellSizeValueSpan.textContent = `${newSize}px`;
  drawShape();
}

function clearCanvas() {
  canvas.innerHTML = '';
}

function getSelectedStyle() {
  return styleToggle.checked ? 'solid' : 'hollow';
}

function setDisabled(el, on) {
  el.classList.toggle('control-disabled', on);
  el.querySelectorAll('input, button, select').forEach(inp => inp.disabled = on);
}

function updateControls() {
  const selectedShape = shapeSelect.value;
  const isHollow = getSelectedStyle() === 'hollow';
  const noShape = !selectedShape;

  if (noShape) clearCanvas();

  setDisabled(shapeDependentControls, noShape);

  if (!noShape) {
    setDisabled(thicknessGroup, !isHollow);

    if (!rowsInput.value) rowsInput.value = 5;

    const isRect1 = selectedShape === 'rectangle1';
    setDisabled(colsGroup, !isRect1);
    if (isRect1 && !colsInput.value) colsInput.value = 10;
  }
}


function drawShape() {
  clearCanvas();
  const selectedShape = shapeSelect.value;

  const shapeMap = {
    rectangle1: drawRectangle1,
    rectangle2: drawRectangle2,
    triangle1: drawTriangle1,
    triangle2: drawTriangle2,
    triangle3: drawTriangle3,
    triangle4: drawTriangle4,
    triangle5: triangle5,
    circle: drawCircle
  };

  const drawFunc = shapeMap[selectedShape];
  if (drawFunc) {
    renderShape(drawFunc());
  }
}

function renderShape(shapeString) {
  for (const char of shapeString) {
    if (char === '\n') {
      const br = document.createElement('br');
      canvas.appendChild(br);
    } else {
      const span = document.createElement('span');
      span.classList.add('cell');

      if (char === '*') {
        span.textContent = emoji;
      } else if (char === ' ') {
        span.innerHTML = '&nbsp;';
      }
      canvas.appendChild(span);
    }
  }
}

emojiBtn.addEventListener('click', () => pickerOverlay.classList.toggle('open'));

pickerOverlay.addEventListener('click', (e) => {
  if (e.target === pickerOverlay) pickerOverlay.classList.remove('open');
});

document.getElementById('picker-close').addEventListener('click', () => {
  pickerOverlay.classList.remove('open');
});

fillEmojiPicker();
updateCellSize();
updateControls();
drawShape();