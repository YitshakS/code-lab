const EXERCISE_PROMPT_MAP = {
  'emojis.js': 'loops/emojis/prompt.md'
};

const COMMON_FILES = ['loops/README.md', 'loops/script.js', 'loops/index.html'];

const EXERCISE_SOLUTION_MAP = {
  'emojis.js': 'loops/emojis/solution.js',
  'shapes.js': 'loops/shapes/solution.js'
};

let systemPrompt = '';
let exercisePrompt = '';
let conversationHistory = [];
let isLoading = false;

async function loadAIPrompts() {
  try {
    const exerciseFile = EXERCISE_PROMPT_MAP[activeFile] || null;
    const solutionFile = EXERCISE_SOLUTION_MAP[activeFile] || null;

    const fetches = [fetch('ai/ai_system.md'), ...COMMON_FILES.map(f => fetch(f))];
    if (exerciseFile) fetches.push(fetch(exerciseFile));
    if (solutionFile) fetches.push(fetch(solutionFile));

    const responses = await Promise.all(fetches);
    const texts = await Promise.all(responses.map(r => r.text()));

    systemPrompt = texts[0];
    COMMON_FILES.forEach((name, i) => {
      systemPrompt += `\n\n---\n\n### ${name}:\n\`\`\`js\n${texts[1 + i]}\n\`\`\``;
    });

    let idx = 1 + COMMON_FILES.length;
    exercisePrompt = exerciseFile ? texts[idx++] : '';
    if (solutionFile) {
      exercisePrompt += `\n\n---\n\n### ${solutionFile}:\n\`\`\`js\n${texts[idx++]}\n\`\`\``;
    }
  } catch (e) {
    console.error('Failed to load AI prompts:', e);
  }
}

function getStudentCode() {
  if (mode === 'solution' || !EDITABLE_FILES.includes(activeFile)) return '';
  const key = activeFile + '-exercise';
  return editors[key] ? editors[key].getValue() : '';
}

async function callAPI(messages, fullSystem) {
  const res = await fetch(AI_CONFIG.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: fullSystem },
        ...messages
      ]
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'שגיאת API');
  }
  const data = await res.json();
  return data.result.response;
}

async function callGemini(userText) {
  const code = getStudentCode();
  const messageWithContext = code
    ? `${userText}\n\n[קוד התלמיד הנוכחי:]\n\`\`\`js\n${code}\n\`\`\``
    : userText;

  conversationHistory.push({ role: 'user', content: messageWithContext });

  const windowed = conversationHistory.slice(-AI_CONFIG.historyWindow);
  const fullSystem = systemPrompt + (exercisePrompt ? '\n\n---\n\n' + exercisePrompt : '');

  let aiText;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      aiText = await callAPI(windowed, fullSystem);
      break;
    } catch (e) {
      if (attempt < 2 && e.message.includes('overloaded')) {
        await new Promise(r => setTimeout(r, 4000));
        continue;
      }
      throw e;
    }
  }

  conversationHistory.push({ role: 'assistant', content: aiText });
  return aiText;
}

function renderMarkdown(text) {
  return text
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function addMessage(role, text) {
  const messages = document.getElementById('ai-messages');
  const div = document.createElement('div');
  div.className = `ai-message ai-${role}`;
  div.innerHTML = renderMarkdown(text);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function setLoading(on) {
  isLoading = on;
  document.getElementById('ai-send').disabled = on;
  document.getElementById('ai-input').disabled = on;

  const existing = document.getElementById('ai-typing');
  if (on && !existing) {
    const typing = document.createElement('div');
    typing.id = 'ai-typing';
    typing.className = 'ai-message ai-model';
    typing.innerHTML = '<span class="ai-dots"><span>.</span><span>.</span><span>.</span></span>';
    document.getElementById('ai-messages').appendChild(typing);
    document.getElementById('ai-messages').scrollTop = document.getElementById('ai-messages').scrollHeight;
  } else if (!on && existing) {
    existing.remove();
  }
}

async function handleSend() {
  const input = document.getElementById('ai-input');
  const text = input.value.trim();
  if (!text || isLoading) return;

  input.value = '';
  addMessage('user', text);
  setLoading(true);

  try {
    const response = await callGemini(text);
    setLoading(false);
    addMessage('model', response);
  } catch (e) {
    setLoading(false);
    addMessage('error', `שגיאה: ${e.message}`);
  }
}

function initAI() {
  loadAIPrompts();

  const aiBtn   = document.getElementById('ai-btn');
  const aiPanel = document.getElementById('ai-panel');
  const aiClose = document.getElementById('ai-close');
  const aiSend  = document.getElementById('ai-send');
  const aiInput = document.getElementById('ai-input');

  aiBtn.addEventListener('click', () => {
    const open = aiPanel.classList.toggle('open');
    aiBtn.classList.toggle('active', open);
  });

  aiClose.addEventListener('click', () => {
    aiPanel.classList.remove('open');
    aiBtn.classList.remove('active');
  });

  aiSend.addEventListener('click', handleSend);

  aiInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}

// initAI() is called by wrapper.js after topic config and files are loaded
