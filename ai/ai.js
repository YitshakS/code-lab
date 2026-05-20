const EXERCISE_PROMPT_MAP = {
  'emojis.js': 'loops/emojis/prompt.md'
};

const EXERCISE_STATIC_FILES = {
  'emojis.js': ['loops/instructions.md', 'loops/script.js', 'loops/index.html', 'loops/emojis/solution.js']
};

let systemPrompt = '';
let exercisePrompt = '';
let conversationHistory = [];
let isLoading = false;

async function loadAIPrompts() {
  try {
    const exerciseFile = EXERCISE_PROMPT_MAP[activeFile] || null;
    const staticFiles = EXERCISE_STATIC_FILES[activeFile] || [];

    const fetches = [fetch('ai/ai_system.md')];
    if (exerciseFile) fetches.push(fetch(exerciseFile));
    staticFiles.forEach(f => fetches.push(fetch(f)));

    const responses = await Promise.all(fetches);
    const texts = await Promise.all(responses.map(r => r.text()));

    systemPrompt = texts[0];
    let idx = 1;
    exercisePrompt = exerciseFile ? texts[idx++] : '';

    for (let i = 0; i < staticFiles.length; i++) {
      exercisePrompt += `\n\n---\n\n### ${staticFiles[i]}:\n\`\`\`js\n${texts[idx++]}\n\`\`\``;
    }
  } catch (e) {
    console.error('Failed to load AI prompts:', e);
  }
}

function getStudentCode() {
  if (typeof editor !== 'undefined' && !showingSolution) {
    return editor.getValue();
  }
  return '';
}

async function callGemini(userText) {
  const code = getStudentCode();
  const messageWithContext = code
    ? `${userText}\n\n[קוד התלמיד הנוכחי:]\n\`\`\`js\n${code}\n\`\`\``
    : userText;

  conversationHistory.push({ role: 'user', parts: [{ text: messageWithContext }] });

  const windowed = conversationHistory.slice(-AI_CONFIG.historyWindow);
  const fullSystem = systemPrompt + (exercisePrompt ? '\n\n---\n\n' + exercisePrompt : '');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.model}:generateContent?key=${AI_CONFIG.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: fullSystem }] },
        contents: windowed,
        generationConfig: {}
      })
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'שגיאת API');
  }

  const data = await res.json();
  const aiText = data.candidates[0].content.parts[0].text;
  conversationHistory.push({ role: 'model', parts: [{ text: aiText }] });
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

initAI();
