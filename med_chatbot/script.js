const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('input');
const sendButton = document.getElementById('send-button');
const loadingIndicator = document.getElementById('loading-indicator');

let conversationHistory = [
    { role: "system", content: "You are a helpful AI doctor." }
];

function appendMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = marked.parse(text);
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: "smooth" });
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
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `Error ${response.status}`);

        const aiReply = data.choices[0].message.content;
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

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
userInput.addEventListener('input', autoExpandTextarea);
autoExpandTextarea();