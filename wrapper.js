// Dynamic topic config — populated by loadTopicConfig()
let TAB_FILES = [];
let FILE_MODES = {};
let FETCH_MAP = {};
let SOLUTION_MAP = {};
let EDITABLE_FILES = [];

const topic = new URLSearchParams(window.location.search).get('topic') || 'loops';
const topicPrefix = topic + '/';

const files = {};
const editors = {};
let activeFile = null;
let mode = 'solution'; // 'solution' | 'auto' | 'paused'
let instructionsCodeMode = false;
let savedReadmeSelection = null;

async function loadTopicConfig() {
  const res = await fetch(topicPrefix + 'config.json');
  if (!res.ok) throw new Error(`Failed to load ${topicPrefix}config.json`);
  const config = await res.json();

  TAB_FILES = config.tabs.map(t => t.name);
  config.tabs.forEach(tab => {
    FILE_MODES[tab.name] = tab.mode !== undefined ? tab.mode : null;
    FETCH_MAP[tab.name] = topicPrefix + (tab.fetch || tab.name);
    if (tab.type === 'exercise') {
      SOLUTION_MAP[tab.name] = topicPrefix + tab.solution;
      EDITABLE_FILES.push(tab.name);
    }
  });

  // Load topic-specific JS (getIframeState, buildPreview, etc.)
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = topicPrefix + 'topic.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadFiles() {
  await Promise.all(TAB_FILES.map(async name => {
    const res = await fetch(FETCH_MAP[name]);
    if (!res.ok) throw new Error(`Failed to load ${FETCH_MAP[name]}`);
    files[name] = await res.text();
  }));

  const sharedRes = await fetch('shared.css');
  files['__shared__'] = sharedRes.ok ? await sharedRes.text() : '';

  const extraFiles = window.TOPIC?.extraFiles || [];
  await Promise.all(extraFiles.map(async name => {
    const res = await fetch(topicPrefix + name);
    if (!res.ok) throw new Error(`Failed to load ${name}`);
    files[name] = await res.text();
  }));

  await Promise.all(Object.values(SOLUTION_MAP).map(async path => {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    files[path] = await res.text();
  }));
}

let debounceTimer = null;
function onEditorChange() {
  if (mode !== 'auto') return;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runCode, 400);
}

function createEditor(key, content, editorMode, readOnly) {
  const container = document.createElement('div');
  container.className = 'cm-instance';
  container.style.display = 'none';
  document.getElementById('editors-container').appendChild(container);

  const cm = CodeMirror(container, {
    value: content,
    mode: editorMode,
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
    const lang = Object.entries(modeMap).find(([cls]) => block.classList.contains(cls))?.[1];
    if (!lang) return;
    const code = block.textContent;
    block.innerHTML = '';
    CodeMirror.runMode(code, lang, block);
    block.classList.add('cm-s-dracula');
  });
}

function buildTabs() {
  const tabsEl = document.getElementById('tabs');
  tabsEl.innerHTML = '';
  const readmeFile = TAB_FILES[0];

  TAB_FILES.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.file = name;

    if (name === readmeFile) {
      btn.classList.add('readonly', 'active');
      btn.innerHTML = `${name} <span id="instructions-mode-switch"><span id="code-icon" data-tooltip="הצג קוד">&#x1F512;</span><span id="read-icon" class="active" data-tooltip="מצב קריאה">&#x1F441;</span></span>`;
    } else if (EDITABLE_FILES.includes(name)) {
      btn.classList.add('exercise');
      btn.innerHTML = `${name} <span class="exercise-mode-icon">&#x1F512;</span>`;
    } else {
      btn.classList.add('readonly');
      btn.innerHTML = `${name} &#x1F512;`;
    }

    tabsEl.appendChild(btn);
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const readmeFile = TAB_FILES[0];
      if (e.target.id === 'read-icon') {
        if (activeFile !== readmeFile) switchTab(readmeFile);
        if (instructionsCodeMode) {
          hideActiveEditor();
          instructionsCodeMode = false;
          showActiveEditor();
          updateInstructionsModeSwitch();
        }
        return;
      }
      if (e.target.id === 'code-icon') {
        if (activeFile !== readmeFile) switchTab(readmeFile);
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
}

function initEditors() {
  const readmeFile = TAB_FILES[0];
  document.getElementById('instructions-rendered').innerHTML = marked.parse(files[readmeFile]);
  highlightCodeBlocks();
  createEditor(readmeFile + '-code', files[readmeFile], null, true);

  TAB_FILES.filter(name => name !== readmeFile && !EDITABLE_FILES.includes(name)).forEach(name => {
    createEditor(name, files[name], FILE_MODES[name], true);
  });

  EDITABLE_FILES.forEach(name => {
    const ex = createEditor(name + '-exercise', files[name], FILE_MODES[name], false);
    ex.on('change', onEditorChange);
    if (SOLUTION_MAP[name]) {
      createEditor(name + '-solution', files[SOLUTION_MAP[name]], FILE_MODES[name], true);
    }
  });
}

function getActiveKey() {
  const readmeFile = TAB_FILES[0];
  if (activeFile === readmeFile) {
    return instructionsCodeMode ? readmeFile + '-code' : null;
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
  document.querySelectorAll('.exercise-mode-icon').forEach(icon => {
    icon.textContent = isMyCode ? '✏️' : '🔒';
  });
}

function updateInstructionsModeSwitch() {
  document.getElementById('read-icon').classList.toggle('active', !instructionsCodeMode);
  document.getElementById('code-icon').classList.toggle('active', instructionsCodeMode);
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
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = match ? match[1] : '';
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return body;
}

function getEditorValue(fileName) {
  if (EDITABLE_FILES.includes(fileName)) {
    const key = mode === 'solution' ? fileName + '-solution' : fileName + '-exercise';
    return editors[key] ? editors[key].getValue() : files[fileName];
  }
  return files[fileName] || '';
}

function runCode() {
  window.TOPIC.buildPreview(files, getEditorValue, files['__shared__'] || '');
}

const preview = document.getElementById('preview');
const splitter = document.getElementById('splitter');
const editorPanel = document.getElementById('editor-panel');
const wrapperContainer = document.getElementById('wrapper-container');
let isDragging = false;

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

document.getElementById('mode-my-code').addEventListener('click', () => setMode('auto'));
document.getElementById('play-btn').addEventListener('click', () => setMode('auto'));
document.getElementById('pause-btn').addEventListener('click', () => setMode('paused'));
document.getElementById('mode-solution').addEventListener('click', () => setMode('solution'));

loadTopicConfig()
  .then(() => loadFiles())
  .then(() => {
    buildTabs();
    initEditors();
    activeFile = TAB_FILES[0];
    updateModeControl();
    updateInstructionsModeSwitch();
    showActiveEditor();
    runCode();
    if (typeof initAI === 'function') initAI();
  })
  .catch(err => {
    document.body.innerHTML = `<p style="color:red;padding:20px;">שגיאה בטעינת קבצי התרגיל: ${err.message}</p>`;
  });
