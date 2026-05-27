// ◻
function drawRectangle1(rows, cols, isSolid, thickness) {
  let shape = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const onBorder = row < thickness || row >= rows - thickness || col < thickness || col >= cols - thickness;
      shape += (isSolid || onBorder) ? '*' : ' ';
    }
    shape += '\n';
  }

  return shape;
}

// ⊠
function drawRectangle2(rows, isSolid, thickness) {
  let s = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < rows; c++) {
      if (isSolid) {
        s += '*';
      } else {
        const onBorder = (r < thickness || r >= rows - thickness || c < thickness || c >= rows - thickness);
        const onDiag1 = Math.abs(r - c) < thickness;
        const onDiag2 = Math.abs((rows - 1 - r) - c) < thickness;
        s += (onBorder || onDiag1 || onDiag2) ? '*' : ' ';
      }
    }
    s += '\n';
  }
  return s;
}

// ◺
function drawTriangle1(rows, isSolid, thickness) {
  let shape = '';

  for (let row = 1; row <= rows; row++) {
    const rowLength = row; // גודל השורה הנוכחית
    for (let col = 0; col < rowLength; col++) {
      if (isSolid) { // אם הצורה מלאה
        shape += '*';
      } else { // אחרת
        const onBottom = row > rows - thickness;
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
function drawTriangle2(rows, isSolid, thickness) {
  let shape = '';

  for (let row = 0; row < rows; row++) {
    const rowLength = rows - row; // גודל השורה הנוכחית
    for (let col = 0; col < rowLength; col++) {
      if (isSolid) { // אם הצורה מלאה
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
function drawTriangle3(rows, isSolid, thickness) {
  let shape = '';

  for (let row = 0; row < rows; row++) {
    const rowLength = rows - row;      // אורך השורה הנוכחית (יורד)
    const spaces = rows - rowLength;   // רווחים לשמאל כדי ליישר לימין

    // רווחים בתחילת השורה
    for (let s = 0; s < spaces; s++) {
      shape += ' ';
    }

    // תאי המשולש
    for (let col = 0; col < rowLength; col++) {
      if (isSolid) {
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
function drawTriangle4(rows, isSolid, thickness) {
  let shape = '';

  for (let row = 1; row <= rows; row++) {
    const rowLength = row;

    const spaces = rows - rowLength; // כמה רווחים לפני הכוכבים
    for (let s = 0; s < spaces; s++) {
      shape += ' ';
    }

    for (let col = 0; col < rowLength; col++) {
      if (isSolid) {
        shape += '*';
      } else {
        const onBottom = row > rows - thickness;
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
function drawTriangle5(rows, isSolid, thickness) {
  let shape = '';

  for (let row = 0; row < rows; row++) {
    const numSpaces = rows - row - 1;
    const numStars = 2 * row + 1;

    // רווחים לפני המשולש
    for (let s = 0; s < numSpaces; s++) {
      shape += ' ';
    }

    // תאי המשולש
    for (let col = 0; col < numStars; col++) {
      if (isSolid) {
        shape += '*';
      } else {
        const onBase = row >= rows - thickness;
        const onLeftEdge = col < thickness;
        const onRightEdge = col >= numStars - thickness;
        shape += (onBase || onLeftEdge || onRightEdge) ? '*' : ' ';
      }
    }
    shape += '\n';
  }
  return shape;
}

// ◯
function drawCircle(rows, isSolid, thickness) {
  let s = '';

  if (rows <= 0) return s;

  const r = (rows - 1) / 2; // רדיוס
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < rows; x++) {
      const d = Math.hypot(x - r, y - r); // מרחק מהמרכז
      if (isSolid) {
        s += (d < r + 0.5) ? '*' : ' ';
      } else {
        s += (d >= r - thickness + 0.5 && d < r + 0.5) ? '*' : ' ';
      }
    }
    s += '\n';
  }
  return s;
}
