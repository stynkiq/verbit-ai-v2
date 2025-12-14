// Replace this with your real key for testing only.
// For production, route through a backend proxy; never expose keys client-side.
const API_KEY = "YOUR_OPENAI_API_KEY";

// Optional: enter-to-send
document.getElementById("user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  // Show a soft typing indicator
  const typingId = showTyping();

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Verbit, a concise, helpful assistant with a warm, modern tone." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "Hmm—no reply was generated.";
    hideTyping(typingId);
    appendMessage("bot", reply);
  } catch (err) {
    hideTyping(typingId);
    appendMessage("bot", "Network hiccup. Try again in a moment.");
  }
}

function appendMessage(sender, text) {
  const chatLog = document.getElementById("chat-log");
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function showTyping() {
  const chatLog = document.getElementById("chat-log");
  const bubble = document.createElement("div");
  bubble.classList.add("message", "bot");
  bubble.style.opacity = "0.9";
  bubble.innerHTML = "Verbit is thinking…";
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
  return bubble;
}

function hideTyping(bubble) {
  if (bubble && bubble.remove) bubble.remove();
}
