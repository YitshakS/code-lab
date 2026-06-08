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

  // כתוב כאן

  return s;
}

// ◺
function drawTriangle1(rows, isSolid, thickness) {
  let shape = '';

  // כתוב כאן

  return shape;
}

// ◸
function drawTriangle2(rows, isSolid, thickness) {
  let shape = '';

  // כתוב כאן

  return shape;
}

// ◹
function drawTriangle3(rows, isSolid, thickness) {
  let shape = '';

  // כתוב כאן

  return shape;
}

// ◿
function drawTriangle4(rows, isSolid, thickness) {
  let shape = '';

  // כתוב כאן

  return shape;
}

// △
function drawTriangle5(rows, isSolid, thickness) {
  let shape = '';

  // כתוב כאן

  return shape;
}

// ◯
function drawCircle(rows, isSolid, thickness) {
  let s = '';

  // כתוב כאן

  return s;
}
