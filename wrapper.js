const TAB_FILES = ['index.html', 'style.css', 'script.js', 'emojis.js', 'shapes.js'];
const FILE_MODES = {
  'index.html': 'htmlmixed',
  'style.css': 'css',
  'script.js': 'javascript',
  'emojis.js': 'javascript',
  'shapes.js': 'javascript'
};
const FETCH_MAP = {
  'index.html': 'loops/index.html',
  'style.css':  'loops/style.css',
  'script.js':  'loops/script.js',
  'emojis.js':  'loops/emojis/exercise.js',
  'shapes.js':  'loops/shapes/exercise.js'
};
const SOLUTION_MAP = { 'emojis.js': 'loops/emojis/solution.js' };

const files = {};
let editor;
let activeFile = 'emojis.js';
let showingSolution = false;
let studentSnapshot = null;

async function loadFiles() {
  await Promise.all(TAB_FILES.map(async name => {
    const fetchName = FETCH_MAP[name] || name;
    const res = await fetch(fetchName);
    if (!res.ok) throw new Error(`Failed to load ${fetchName}`);
    files[name] = await res.text();
  }));
  await Promise.all(Object.values(SOLUTION_MAP).map(async name => {
    const res = await fetch(name);
    if (!res.ok) throw new Error(`Failed to load ${name}`);
    files[name] = await res.text();
  }));
}

function initEditor() {
  editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: FILE_MODES[activeFile],
    theme: 'dracula',
    lineNumbers: true,
    tabSize: 2,
    indentWithTabs: false,
    lineWrapping: false,
    autofocus: true,
  });
  editor.setValue(files[activeFile]);
  editor.clearHistory();

  editor.on('change', onEditorChange);
}

function onEditorChange() {
  if (!autoRun) return;
  runCode();
}

const EDITABLE_FILES = ['emojis.js', 'shapes.js'];

function updateSolutionBtn() {
  const modeSwitch = document.getElementById('mode-switch');
  if (SOLUTION_MAP[activeFile]) {
    modeSwitch.style.display = '';
    document.getElementById('exercise-icon').classList.toggle('active', !showingSolution);
    document.getElementById('solution-icon').classList.toggle('active', showingSolution);
  } else {
    modeSwitch.style.display = 'none';
  }
}

function toggleSolution() {
  if (!SOLUTION_MAP[activeFile]) return;
  if (!showingSolution) {
    studentSnapshot = { value: editor.getValue(), history: editor.getHistory() };
    editor.off('change', onEditorChange);
    editor.setValue(files[SOLUTION_MAP[activeFile]]);
    editor.clearHistory();
    editor.on('change', onEditorChange);
    editor.setOption('readOnly', true);
    showingSolution = true;
    runCode();
  } else {
    editor.off('change', onEditorChange);
    editor.setValue(studentSnapshot.value);
    editor.setHistory(studentSnapshot.history);
    editor.on('change', onEditorChange);
    editor.setOption('readOnly', false);
    showingSolution = false;
    studentSnapshot = null;
    runCode();
  }
  updateSolutionBtn();
}

function switchTab(fileName) {
  if (fileName === activeFile) return;
  if (showingSolution && studentSnapshot) {
    files[activeFile] = studentSnapshot.value;
    showingSolution = false;
    studentSnapshot = null;
  } else if (EDITABLE_FILES.includes(activeFile)) {
    files[activeFile] = editor.getValue();
  }
  activeFile = fileName;

  const isReadOnly = !EDITABLE_FILES.includes(fileName);
  editor.off('change', onEditorChange);
  editor.setValue(files[fileName]);
  editor.clearHistory();
  editor.on('change', onEditorChange);
  editor.setOption('mode', FILE_MODES[fileName]);
  editor.setOption('readOnly', isReadOnly);

  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.file === fileName);
  });
  updateSolutionBtn();
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = match ? match[1] : '';
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return body;
}

function getIframeState() {
  try {
    const doc = preview.contentDocument;
    if (!doc || !doc.getElementById('shape-select')) return null;
    const sel = id => doc.getElementById(id);
    return {
      shape:    sel('shape-select').value,
      rows:     sel('rows-input').value,
      cols:     sel('cols-input').value,
      style:    sel('style-toggle').checked,
      thickness:sel('thickness-input').value,
      cellSize: sel('cell-size-slider').value,
      darkMode: sel('mode-toggle').checked,
      border:   sel('border-toggle').checked,
      emoji:    preview.contentWindow.emoji || '\u2B50',
    };
  } catch(e) { return null; }
}

function buildRestoreScript(state) {
  if (!state || !state.shape) return '';
  return `<script>
(function() {
  const s = ${JSON.stringify(state)};
  const sel = id => document.getElementById(id);
  sel('mode-toggle').checked   = s.darkMode;
  sel('border-toggle').checked = s.border;
  if (s.darkMode) document.body.classList.add('dark-mode');
  if (s.border)   sel('canvas-panel').classList.add('show-border');
  sel('shape-select').value    = s.shape;
  sel('style-toggle').checked  = s.style;
  sel('thickness-input').value = s.thickness;
  sel('rows-input').value      = s.rows;
  sel('cols-input').value      = s.cols;
  sel('cell-size-slider').value = s.cellSize;
  document.documentElement.style.setProperty('--cell-size', s.cellSize + 'px');
  sel('cell-size-value').textContent = s.cellSize + 'px';
  emoji = s.emoji;
  sel('emoji-btn').textContent = s.emoji;
  updateControls();
  drawShape();
})();
<\/script>`;
}

function runCode() {
  if (!showingSolution) {
    files[activeFile] = editor.getValue();
  }

  const state = getIframeState();
  const bodyContent = extractBody(files['index.html']);
  const emojisContent = (showingSolution && activeFile === 'emojis.js')
    ? editor.getValue()
    : files['emojis.js'];

  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${files['style.css']}</style>
</head>
<body>
${bodyContent}
<script>${emojisContent}<\/script>
<script>${files['shapes.js']}<\/script>
<script>${files['script.js']}<\/script>
${buildRestoreScript(state)}
</body>
</html>`;

  preview.srcdoc = html;
}

let autoRun = false;
let debounceTimer = null;

const autoBtn   = document.getElementById('auto-btn');
const runBtn    = document.getElementById('run-btn');
const autoLabel = document.getElementById('auto-label');
const runLabel  = document.getElementById('run-label');

function updateButtonStates() {
  autoBtn.classList.toggle('active',   autoRun);
  runBtn.classList.toggle('inactive',  autoRun);
  autoLabel.classList.toggle('active', autoRun);
  runLabel.classList.toggle('active',  !autoRun);
}

autoBtn.addEventListener('click', () => {
  if (autoRun) return;
  autoRun = true;
  updateButtonStates();
});

const splitter = document.getElementById('splitter');
const editorPanel = document.getElementById('editor-panel');
const wrapperContainer = document.getElementById('wrapper-container');
let isDragging = false;

const preview = document.getElementById('preview');

splitter.addEventListener('mousedown', () => {
  isDragging = true;
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'ew-resize';
  preview.style.pointerEvents = 'none';
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const rect = wrapperContainer.getBoundingClientRect();
  const newWidth = Math.max(200, Math.min(e.clientX - rect.left, rect.width - 200));
  editorPanel.style.width = `${newWidth}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  preview.style.pointerEvents = '';
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    if (e.target.id === 'solution-icon') {
      if (!showingSolution) toggleSolution();
      return;
    }
    if (e.target.id === 'exercise-icon') {
      if (showingSolution) toggleSolution();
      return;
    }
    switchTab(tab.dataset.file);
  });
});

runBtn.addEventListener('click', () => {
  if (autoRun) {
    autoRun = false;
    updateButtonStates();
  } else {
    runCode();
  }
});

loadFiles()
  .then(() => {
    initEditor();
    updateButtonStates();
    updateSolutionBtn();
    runCode();
  })
  .catch(err => {
    document.body.innerHTML = `<p style="color:red;padding:20px;">שגיאה בטעינת קבצי התרגיל: ${err.message}</p>`;
  });
