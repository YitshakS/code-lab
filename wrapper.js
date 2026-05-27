const TAB_FILES = ['instructions.md', 'index.html', 'style.css', 'script.js', 'emojis.js', 'shapes.js'];
const FILE_MODES = {
  'instructions.md': null,
  'index.html': 'htmlmixed',
  'style.css': 'css',
  'script.js': 'javascript',
  'emojis.js': 'javascript',
  'shapes.js': 'javascript'
};
const FETCH_MAP = {
  'instructions.md': 'loops/instructions.md',
  'index.html': 'loops/index.html',
  'style.css':  'loops/style.css',
  'script.js':  'loops/script.js',
  'emojis.js':  'loops/emojis/exercise.js',
  'shapes.js':  'loops/shapes/exercise.js'
};
const SOLUTION_MAP = { 'emojis.js': 'loops/emojis/solution.js', 'shapes.js': 'loops/shapes/solution.js' };
const EDITABLE_FILES = ['emojis.js', 'shapes.js'];

const files = {};
const editors = {};
let activeFile = 'instructions.md';
let mode = 'solution'; // 'solution' | 'auto' | 'paused'
let instructionsCodeMode = false;
let savedReadmeSelection = null;

async function loadFiles() {
  await Promise.all(TAB_FILES.map(async name => {
    const fetchName = FETCH_MAP[name] || name;
    const res = await fetch(fetchName);
    if (!res.ok) throw new Error(`Failed to load ${fetchName}`);
    files[name] = await res.text();
  }));
  const restoreRes = await fetch('loops/restore.js');
  if (!restoreRes.ok) throw new Error('Failed to load loops/restore.js');
  files['restore.js'] = await restoreRes.text();
  await Promise.all(Object.values(SOLUTION_MAP).map(async name => {
    const res = await fetch(name);
    if (!res.ok) throw new Error(`Failed to load ${name}`);
    files[name] = await res.text();
  }));
}

function onEditorChange() {
  if (mode === 'auto') runCode();
}


function createEditor(key, content, mode, readOnly) {
  const container = document.createElement('div');
  container.className = 'cm-instance';
  container.style.display = 'none';
  document.getElementById('editors-container').appendChild(container);

  const cm = CodeMirror(container, {
    value: content,
    mode: mode,
    theme: 'dracula',
    lineNumbers: true,
    tabSize: 2,
    indentWithTabs: false,
    lineWrapping: false,
    readOnly: readOnly,
  });

  editors[key] = cm;
  return cm;
}

function highlightCodeBlocks() {
  const modeMap = { 'language-js': 'javascript', 'language-javascript': 'javascript', 'language-css': 'css', 'language-html': 'htmlmixed' };
  document.querySelectorAll('#instructions-rendered pre code').forEach(block => {
    const mode = Object.entries(modeMap).find(([cls]) => block.classList.contains(cls))?.[1];
    if (!mode) return;
    const code = block.textContent;
    block.innerHTML = '';
    CodeMirror.runMode(code, mode, block);
    block.classList.add('cm-s-dracula');
  });
}

function initEditors() {
  document.getElementById('instructions-rendered').innerHTML = marked.parse(files['instructions.md']);
  highlightCodeBlocks();
  createEditor('instructions.md-code', files['instructions.md'], null, true);

  for (const name of ['index.html', 'style.css', 'script.js']) {
    createEditor(name, files[name], FILE_MODES[name], true);
  }

  for (const name of EDITABLE_FILES) {
    const ex = createEditor(name + '-exercise', files[name], FILE_MODES[name], false);
    ex.on('change', onEditorChange);
    if (SOLUTION_MAP[name]) {
      createEditor(name + '-solution', files[SOLUTION_MAP[name]], FILE_MODES[name], true);
    }
  }
}

function getActiveKey() {
  if (activeFile === 'instructions.md') {
    return instructionsCodeMode ? 'instructions.md-code' : null;
  }
  if (EDITABLE_FILES.includes(activeFile)) {
    return mode === 'solution' ? activeFile + '-solution' : activeFile + '-exercise';
  }
  return activeFile;
}

function hideActiveEditor() {
  const key = getActiveKey();
  if (key) {
    editors[key].getWrapperElement().parentElement.style.display = 'none';
  } else {
    const sel = window.getSelection();
    savedReadmeSelection = sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
    document.getElementById('instructions-rendered').style.display = 'none';
  }
}

function showActiveEditor() {
  const key = getActiveKey();
  if (key) {
    const cm = editors[key];
    cm.getWrapperElement().parentElement.style.display = '';
    cm.refresh();
    cm.focus();
  } else {
    document.getElementById('instructions-rendered').style.display = 'block';
    if (savedReadmeSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedReadmeSelection);
      savedReadmeSelection = null;
    }
  }
}

function updateModeControl() {
  const isMyCode = mode !== 'solution';
  document.getElementById('mode-my-code').classList.toggle('active', isMyCode);
  document.getElementById('play-btn').classList.toggle('active', mode === 'auto');
  document.getElementById('pause-btn').classList.toggle('active', mode === 'paused');
  document.getElementById('mode-solution').classList.toggle('active', mode === 'solution');
}

function updateInstructionsModeSwitch() {
  const sw = document.getElementById('instructions-mode-switch');
  const isInstructions = activeFile === 'instructions.md';
  sw.style.display = isInstructions ? '' : 'none';
  if (isInstructions) {
    document.getElementById('read-icon').classList.toggle('active', !instructionsCodeMode);
    document.getElementById('code-icon').classList.toggle('active', instructionsCodeMode);
  }
}

function setMode(newMode) {
  const wasMyCode = mode !== 'solution';
  const isMyCode = newMode !== 'solution';
  const needsEditorSwitch = EDITABLE_FILES.includes(activeFile) && wasMyCode !== isMyCode;
  if (needsEditorSwitch) hideActiveEditor();
  mode = newMode;
  if (needsEditorSwitch) showActiveEditor();
  updateModeControl();
  if (mode !== 'paused') runCode();
}

function switchTab(fileName) {
  if (fileName === activeFile) return;
  hideActiveEditor();
  activeFile = fileName;
  showActiveEditor();

  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.file === fileName);
  });
  updateModeControl();
  updateInstructionsModeSwitch();

  if (fileName !== 'instructions.md') {
    runCode();
  }
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
      emoji:    preview.contentWindow.emoji || '⭐',
    };
  } catch(e) { return null; }
}

function buildRestoreScript(state) {
  if (state && state.shape) {
    return `<script>restoreState(${JSON.stringify(state)});updateControls();drawShape();<\/script>`;
  }
  return `<script>updateControls();drawShape();<\/script>`;
}

function buildAndRun(emojisContent, shapesContent) {
  const state = getIframeState();
  const bodyContent = extractBody(files['index.html']);
  preview.srcdoc = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${files['style.css']}</style>
</head>
<body>
${bodyContent}
<script>${files['restore.js']}<\/script>
<script>${emojisContent}<\/script>
<script>${shapesContent}<\/script>
<script>${files['script.js']}<\/script>
${buildRestoreScript(state)}
</body>
</html>`;
}

function runSolution() {
  buildAndRun(
    files[SOLUTION_MAP['emojis.js']] || files['emojis.js'],
    files[SOLUTION_MAP['shapes.js']] || files['shapes.js']
  );
}

function runCode() {
  const isSolution = mode === 'solution';
  const emojisKey = isSolution ? 'emojis.js-solution' : 'emojis.js-exercise';
  const emojisContent = editors[emojisKey] ? editors[emojisKey].getValue() : files['emojis.js'];
  const shapesKey = isSolution ? 'shapes.js-solution' : 'shapes.js-exercise';
  const shapesContent = editors[shapesKey] ? editors[shapesKey].getValue() : files['shapes.js'];
  buildAndRun(emojisContent, shapesContent);
}

document.getElementById('mode-my-code').addEventListener('click', () => setMode('auto'));
document.getElementById('play-btn').addEventListener('click', () => setMode('auto'));
document.getElementById('pause-btn').addEventListener('click', () => setMode('paused'));
document.getElementById('mode-solution').addEventListener('click', () => setMode('solution'));

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
    if (e.target.id === 'read-icon') {
      if (instructionsCodeMode) {
        hideActiveEditor();
        instructionsCodeMode = false;
        showActiveEditor();
        updateInstructionsModeSwitch();
      }
      return;
    }
    if (e.target.id === 'code-icon') {
      if (!instructionsCodeMode) {
        hideActiveEditor();
        instructionsCodeMode = true;
        showActiveEditor();
        updateInstructionsModeSwitch();
      }
      return;
    }
    switchTab(tab.dataset.file);
  });
});

loadFiles()
  .then(() => {
    initEditors();
    updateModeControl();
    updateInstructionsModeSwitch();
    showActiveEditor();
    runSolution();
  })
  .catch(err => {
    document.body.innerHTML = `<p style="color:red;padding:20px;">שגיאה בטעינת קבצי התרגיל: ${err.message}</p>`;
  });
