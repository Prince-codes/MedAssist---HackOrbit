const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('input');
const sendButton = document.getElementById('send-button');
const loadingIndicator = document.getElementById('loading-indicator');

// Typing animation for greeting
function typeGreeting(text, speed = 40) {
  return new Promise((resolve) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'ai');
    chatHistory.appendChild(messageElement);
    let i = 0;
    function typeChar() {
      if (i <= text.length) {
        messageElement.innerHTML = marked.parse(
          text.slice(0, i) +
            (i < text.length ? '<span class="blinking-cursor">|</span>' : '')
        );
        chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
        i++;
        setTimeout(typeChar, i < text.length ? speed : 400);
      } else {
        messageElement.innerHTML = marked.parse(text);
        resolve();
      }
    }
    typeChar();
  });
}

let conversationHistory = [{ role: 'system', content: 'You are a helpful AI doctor.' }];

function appendMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.innerHTML = marked.parse(text);
  chatHistory.appendChild(messageElement);
  chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
}

function autoExpandTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
  userInput.style.overflowY = userInput.scrollHeight > 120 ? 'auto' : 'hidden';
}

async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage === '') return;

  appendMessage('user', userMessage);
  userInput.value = '';
  autoExpandTextarea();

  sendButton.disabled = true;
  userInput.disabled = true;
  loadingIndicator.style.visibility = 'visible';

  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `Error ${response.status}`);

    // ✅ OpenRouter returns choices[0].message.content
    const aiReply = data.choices?.[0]?.message?.content || "Sorry, I didn't get a response.";
    appendMessage('ai', aiReply);
    conversationHistory.push({ role: 'assistant', content: aiReply });
  } catch (error) {
    console.error(error);
    appendMessage('ai', `Error: ${error.message}`);
  } finally {
    sendButton.disabled = false;
    userInput.disabled = false;
    loadingIndicator.style.visibility = 'hidden';
    userInput.focus();
  }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
userInput.addEventListener('input', autoExpandTextarea);

// --- On load ---
window.addEventListener('DOMContentLoaded', async () => {
  chatHistory.innerHTML = '';
  await typeGreeting('Hello! Ask me about your medical queries.');

  // Quick replies logic
  const quickReplies = document.querySelectorAll('.quick-btn');
  quickReplies.forEach((btn) => {
    btn.addEventListener('click', () => {
      userInput.value = btn.textContent;
      autoExpandTextarea();
      sendMessage();
    });
  });

  // Attachment logic
  const attachBtn = document.getElementById('attach-btn');
  if (attachBtn && !document.getElementById('file-input')) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.style.display = 'none';
    attachBtn.parentNode.insertBefore(fileInput, attachBtn.nextSibling);
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        appendMessage('user', `📎 Attached: ${fileInput.files[0].name}`);
      }
    });
  }

  // Mic logic
  const micBtn = document.getElementById('mic-btn');
  if (micBtn) micBtn.addEventListener('click', toggleSpeechToText);
});

// --- Speech to Text Logic ---
let recognition;
let isListening = false;

function toggleSpeechToText() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition is not supported in this browser.');
    return;
  }
  if (!recognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      autoExpandTextarea();
    };
    recognition.onerror = (event) => alert('Speech recognition error: ' + event.error);
    recognition.onend = () => {
      isListening = false;
      updateMicBtnState();
    };
  }
  if (!isListening) {
    recognition.start();
    isListening = true;
  } else {
    recognition.stop();
    isListening = false;
  }
  updateMicBtnState();
}

function updateMicBtnState() {
  const btn = document.getElementById('mic-btn');
  if (btn) {
    if (isListening) {
      btn.classList.add('listening');
    } else {
      btn.classList.remove('listening');
    }
  }
}

// Blinking cursor style
const style = document.createElement('style');
style.innerHTML = `.blinking-cursor { display: inline-block; width: 1ch; animation: blink 1s steps(1) infinite; }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`;
document.head.appendChild(style);
