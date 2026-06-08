function restoreState(s) {
  const sel = id => document.getElementById(id);
  sel('mode-toggle').checked   = s.darkMode;
  sel('border-toggle').checked = s.border;
  document.body.classList.toggle('dark-mode', s.darkMode);
  sel('canvas-panel').classList.toggle('show-border', s.border);
  sel('shape-select').value     = s.shape;
  sel('style-toggle').checked   = s.style;
  sel('thickness-input').value  = s.thickness;
  sel('rows-input').value       = s.rows;
  sel('cols-input').value       = s.cols;
  sel('cell-size-slider').value = s.cellSize;
  document.documentElement.style.setProperty('--cell-size', s.cellSize + 'px');
  sel('cell-size-value').textContent = s.cellSize + 'px';
  emoji = s.emoji;
  sel('emoji-btn').textContent = s.emoji;
}
