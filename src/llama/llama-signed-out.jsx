import { useEffect } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "../css/sidebar.css";
import "../css/styles.css";

function llama() {
  useEffect(() => {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    const API_KEY = "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";

    const sendMessage = async () => {
      const message = userInput.value.trim();
      if (message !== "") {
        addUserMessage(message);
        userInput.value = "";

        const typingIndicator = addTypingIndicator();

        try {
          const botResponse = await getOpenRouterResponse(message);
          removeTypingIndicator(typingIndicator);
          addBotMessage(botResponse);
        } catch (error) {
          removeTypingIndicator(typingIndicator);
          addBotMessage("Sorry, I'm having trouble connecting to the AI service.");
          console.error("Error:", error);
        }
      }
    };

    const getOpenRouterResponse = async (userMessage) => {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-8b-instruct:free",
          messages: [{ role: "user", content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? "No response received.";
    };

    const addUserMessage = (message) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "user-message");
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      scrollToBottom();
    };

    const addBotMessage = (message) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "bot-message");
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      scrollToBottom();
    };

    const addTypingIndicator = () => {
      const typingElement = document.createElement("div");
      typingElement.classList.add("message", "bot-message", "typing");
      typingElement.id = "typing-indicator";
      typingElement.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
      chatMessages.appendChild(typingElement);
      scrollToBottom();
      return typingElement;
    };

    const removeTypingIndicator = (typingElement) => {
      typingElement.remove();
    };

    const scrollToBottom = () => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    return () => {
      sendButton.removeEventListener("click", sendMessage);
    };
  }, []);

  return (
    <main className="main-content bg-light">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Meta: Llama 3.3 8B Instruct</h2>
        </div>
        <div className="chat-messages" id="chat-messages"></div>
        <div className="chat-input">
          <input type="text" id="user-input" placeholder="Type your message..." />
          <button id="send-button">Send</button>
        </div>
      </div>
    </main>
  );
}

export default llama;
