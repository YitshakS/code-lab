const emoji = '⭐';
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

function updateControls() {
  const selectedShape = shapeSelect.value;
  const isHollow = getSelectedStyle() === 'hollow';

  const show = (el, on) => el.style.display = on ? 'block' : 'none';
  // חדש: הצגה כ-flex רק לקבוצות שצריכות label לצד input
  const showFlex = (el, on) => el.style.display = on ? 'flex' : 'none';

  show(shapeDependentControls, !!selectedShape);

  if (!selectedShape) {
    clearCanvas();
    showFlex(thicknessGroup, false);
    showFlex(rowsGroup, false);
    showFlex(colsGroup, false);
    return;
  }

  // הכותרת לצד ה-input
  showFlex(thicknessGroup, isHollow);

  // שורות תמיד מוצג, לצד ה-input
  showFlex(rowsGroup, true);
  if (!rowsInput.value) rowsInput.value = 5;

  const isRectangleWithCols = (selectedShape === 'rectangle1');
  // עמודות לצד ה-input רק במלבנים הרלוונטיים
  showFlex(colsGroup, isRectangleWithCols);
  if (isRectangleWithCols && !colsInput.value) colsInput.value = 10;
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

// ◻
function drawRectangle1() {
  const rowsNum = parseInt(rowsInput.value) || 0;
  const numCols = parseInt(colsInput.value) || 0;
  const selectedStyle = getSelectedStyle();
  const thickness = Math.max(1, parseInt(thicknessInput.value) || 1);
  let shape = '';

  for (let row = 0; row < rowsNum; row++) {
    for (let col = 0; col < numCols; col++) {
      if (selectedStyle === 'solid') {
        shape += '*';
      } else {
        if (row < thickness || row >= rowsNum - thickness || col < thickness || col >= numCols - thickness) {
          shape += '*';
        } else {
          shape += ' ';
        }
      }
    }
    shape += '\n';
  }

  return shape;
}

// ⊠
function drawRectangle2() {
  const size = parseInt(rowsInput.value) || 0;
  const style = getSelectedStyle();
  const t = Math.max(1, parseInt(thicknessInput.value));
  let s = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (style === 'solid') {
        s += '*';
      } else {
        const onBorder = (r < t || r >= size - t || c < t || c >= size - t);
        const onDiag1 = Math.abs(r - c) < t;
        const onDiag2 = Math.abs((size - 1 - r) - c) < t;
        s += (onBorder || onDiag1 || onDiag2) ? '*' : ' ';
      }
    }
    s += '\n';
  }
  return s;
}


// ◺ 
function drawTriangle1() {
  const rowsNum = parseInt(rowsInput.value) || 0;
  const selectedStyle = getSelectedStyle();
  const thickness = Math.max(1, parseInt(thicknessInput.value));
  let shape = '';

  for (let row = 1; row <= rowsNum; row++) {
    const rowLength = row; // גודל השורה הנוכחית
    for (let col = 0; col < rowLength; col++) {
      if (selectedStyle === 'solid') { // אם הצורה מלאה
        shape += '*';
      } else { // אחרת
        const onBottom = row > rowsNum - thickness;
        const onLeft = col < thickness;
        const onHypotenuse = col >= rowLength - thickness; // האלכסון (היתר במשולש ישר זווית)
        shape += (onBottom || onLeft || onHypotenuse) ? '*' : ' ';
      }
    }
    shape += '\n';
  }
  return shape;
}

// ◸
function drawTriangle2() {
  const rowsNum = parseInt(rowsInput.value) || 0;
  const selectedStyle = getSelectedStyle();
  const thickness = Math.max(1, parseInt(thicknessInput.value));
  let shape = '';

  for (let row = 0; row < rowsNum; row++) {
    const rowLength = rowsNum - row; // גודל השורה הנוכחית
    for (let col = 0; col < rowLength; col++) {
      if (selectedStyle === 'solid') { // אם הצורה מלאה
        shape += '*';
      } else { // אחרת
        const onTop = row < thickness;
        const onLeft = col < thickness;
        const onHypotenuse = col >= rowLength - thickness; // האלכסון (היתר במשולש ישר זווית)
        shape += (onTop || onLeft || onHypotenuse) ? '*' : ' ';
      }
    }
    shape += '\n';
  }

  return shape;
}

// ◹
function drawTriangle3() {
  const rowsNum = parseInt(rowsInput.value) || 0;
  const selectedStyle = getSelectedStyle();
  const thickness = Math.max(1, parseInt(thicknessInput.value));
  let shape = '';

  for (let row = 0; row < rowsNum; row++) {
    const rowLength = rowsNum - row;      // אורך השורה הנוכחית (יורד)
    const spaces = rowsNum - rowLength;   // רווחים לשמאל כדי ליישר לימין

    // רווחים בתחילת השורה
    for (let s = 0; s < spaces; s++) {
      shape += ' ';
    }

    // תאי המשולש
    for (let col = 0; col < rowLength; col++) {
      if (selectedStyle === 'solid') {
        shape += '*';
      } else {
        const onTop = row < thickness;
        const onRight = col >= rowLength - thickness;
        const onHypotenuse = col < thickness; // האלכסון בצד שמאל
        shape += (onTop || onRight || onHypotenuse) ? '*' : ' ';
      }
    }

    shape += '\n';
  }

  return shape;
}

// ◿
function drawTriangle4() {
  const rowsNum = parseInt(rowsInput.value) || 0;
  const selectedStyle = getSelectedStyle();
  const thickness = Math.max(1, parseInt(thicknessInput.value) || 1);
  let shape = '';

  for (let row = 1; row <= rowsNum; row++) {
    const rowLength = row;

    const spaces = rowsNum - rowLength; // כמה רווחים לפני הכוכבים
    for (let s = 0; s < spaces; s++) {
      shape += ' ';
    }

    for (let col = 0; col < rowLength; col++) {
      if (selectedStyle === 'solid') {
        shape += '*';
      } else {
        const onBottom = row > rowsNum - thickness;
        const onRight = col >= rowLength - thickness;
        const onHypotenuse = col < thickness;
        shape += (onBottom || onRight || onHypotenuse) ? '*' : ' ';
      }
    }

    shape += '\n';
  }

  return shape;
}

// △
function triangle5() {
  const rowsNum = parseInt(rowsInput.value) || 0;
  const selectedStyle = getSelectedStyle();
  const thickness = Math.max(1, parseInt(thicknessInput.value) || 1);
  let shape = '';

  for (let row = 0; row < rowsNum; row++) {
    const numSpaces = rowsNum - row - 1;
    const numStars = 2 * row + 1;

    // Add spaces
    for (let s = 0; s < numSpaces; s++) {
      shape += ' ';
    }

    // Add stars
    for (let col = 0; col < numStars; col++) {
      if (selectedStyle === 'solid') {
        shape += '*';
      } else {
        const onBase = row >= rowsNum - thickness;
        const onLeftEdge = col < thickness;
        const onRightEdge = col >= numStars - thickness;
        if (onBase || onLeftEdge || onRightEdge) {
          shape += '*';
        } else {
          shape += ' ';
        }
      }
    }
    shape += '\n';
  }
  return shape;
}


// ◯
function drawCircle() {
  const size = parseInt(rowsInput.value) || 0; // קוטר בפיקסלים-תא (שורות = גובה = רוחב)
  const style = getSelectedStyle();
  const t = Math.max(1, parseInt(thicknessInput.value)); // עובי למסגרת חלולה
  let s = '';

  if (size <= 0) return s;

  const r = (size - 1) / 2; // רדיוס
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - r, y - r); // מרחק מהמרכז
      if (style === 'solid') {
        s += (d < r) ? '*' : ' ';
      } else {
        const innerRadius = r - t;
        s += (d > innerRadius && d < r + 0.5) ? '*' : ' ';
      }
    }
    s += '\n';
  }
  return s;
}

updateCellSize();
updateControls();
drawShape();