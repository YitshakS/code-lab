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
