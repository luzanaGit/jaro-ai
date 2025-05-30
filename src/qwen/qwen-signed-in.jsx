import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { firebase_config } from "../firebase/firebase-config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebase_config);
}
const db = firebase.firestore();
const auth = firebase.auth();

const API_KEY = "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";
const BOT_NAME = "qwen";

function qwen() {
  const [showChatContainer, setShowChatContainer] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chatId, setChatId] = useState(() => localStorage.getItem(`chatId_${BOT_NAME}`) || null);
  const [chatHistory, setChatHistory] = useState([]);
  const chatMessagesRef = useRef(null);
  const currentChatRef = useRef(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        console.log(user.uid);
      } else {
        setUid(null);
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let docRef;

    const initializeAndLoadChat = async () => {
      if (chatId) {
        docRef = db.collection("chats").doc("bots").collection(BOT_NAME).doc(chatId);
      } else {
        const newChatId = db.collection("chats").doc().id;
        localStorage.setItem(`chatId_${BOT_NAME}`, newChatId);
        setChatId(newChatId);
        docRef = db.collection("chats").doc("bots").collection(BOT_NAME).doc(newChatId);

        await docRef.set({
          botName: BOT_NAME,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
          title: "New Chat",
          uuid: uid,
        });
      }

      currentChatRef.current = docRef;

      setMessages([{ sender: "system", text: "Loading chat history...", type: "loading" }]);
      try {
        const messagesSnapshot = await docRef.collection("messages").orderBy("timestamp", "asc").get();

        if (messagesSnapshot.empty) {
          setMessages([{ sender: "bot", text: "Hello! How can I help you today?" }]);
        } else {
          const loadedMessages = messagesSnapshot.docs.map((doc) => doc.data());
          setMessages(loadedMessages);
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        setMessages([{ sender: "bot", text: "Couldn't load previous messages." }]);
      }

      try {
        const historySnapshot = await db.collection("chats").doc("bots").collection(BOT_NAME).orderBy("lastUpdated", "desc").limit(20).get();

        const history = historySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "New Chat",
          uuid: doc.data().uuid,
        }));
        setChatHistory(history);
      } catch (err) {
        console.error("History error:", err);
        setChatHistory([]);
      }
    };

    initializeAndLoadChat();
  }, [chatId, uid]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessage = async (sender, text) => {
    if (!currentChatRef.current) return;
    await currentChatRef.current.collection("messages").add({
      sender: sender,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await currentChatRef.current.update({
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  const updateChatTitle = async (firstMessage) => {
    if (!currentChatRef.current) return;
    const snapshot = await currentChatRef.current.collection("messages").get();
    if (snapshot.size === 1) {
      const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + "..." : firstMessage;
      await currentChatRef.current.update({ title });
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
        model: "qwen/qwen3-30b-a3b:free",
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`API failed with ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "No response received.";
  };

  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;

    setUserInput("");
    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: message }]);
    await saveMessage("user", message);
    updateChatTitle(message);

    const typingIndicator = { sender: "bot", type: "typing" };
    setMessages((prevMessages) => [...prevMessages, typingIndicator]);

    try {
      const botReply = await getOpenRouterResponse(message);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.type !== "typing"));
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botReply }]);
      await saveMessage("bot", botReply);
    } catch (err) {
      console.error(err);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.type !== "typing"));
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Sorry, I'm having trouble connecting to the AI service." }]);
    }
  };

  const newChat = () => {
    localStorage.removeItem(`chatId_${BOT_NAME}`);
    setChatId(null);
    setMessages([]);
    setShowChatContainer(true);
  };

  const selectChat = (selectedId) => {
    localStorage.setItem(`chatId_${BOT_NAME}`, selectedId);
    setChatId(selectedId);
    setMessages([]);
    setShowChatContainer(true);
  };

  const deleteChat = async (idToDelete) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      const chatDocRef = db.collection("chats").doc("bots").collection(BOT_NAME).doc(idToDelete);
      const messagesSnapshot = await chatDocRef.collection("messages").get();

      const batch = db.batch();
      messagesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      await chatDocRef.delete();

      const historySnapshot = await db.collection("chats").doc("bots").collection(BOT_NAME).orderBy("lastUpdated", "desc").limit(20).get();

      const history = historySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "New Chat",
        uuid: doc.data().uuid,
      }));
      setChatHistory(history);

      setShowChatContainer(false);
      console.log("Chat successfully deleted!");
    } catch (error) {
      console.error("Error removing chat: ", error);
    }
  };

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  return (
    <main className="main-content bg-light">
      <div className="d-flex">
        <div className="flex-column bg-dark me-2 rounded-4" style={{ height: "89vh" }}>
          <nav className="nav flex-column">
            <button id="new-chat-btn" className="btn btn-outline-light m-3" onClick={newChat}>
              <i className="bi bi-plus-circle me-2"></i> New Chat
            </button>
            <div className="text-white text-center px-3 mt-1 mb-2 small">Chat History</div>
            <div id="history-list" className="d-flex flex-column m-3">
              {chatHistory
                .filter((chat) => chat.uuid === uid)
                .map((chat) => (
                  <button key={chat.id} className={`btn btn-outline-light history-item mb-3 ${chat.id === chatId ? "active" : ""}`} style={{ width: "200px" }} onClick={() => selectChat(chat.id)}>
                    {chat.title}
                  </button>
                ))}
            </div>
          </nav>
        </div>

        {showChatContainer && (
          <div className="flex-column chat-container ms-2 vw-100" style={{ height: "89vh" }}>
            <div className="chat-header">
              <h2>Qwen: Qwen3 30B A3B</h2>
            </div>
            <div className="chat-messages" id="chat-messages" ref={chatMessagesRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
                  {msg.sender === "bot" && msg.type !== "typing" && <div className="bot-identifier"></div>}
                  {msg.type === "loading" ? (
                    <div className="loading-message">{msg.text}</div>
                  ) : msg.type === "typing" ? (
                    <div className="typing">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  ) : (
                    <div className="message-content">{msg.text}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="chat-input">
              {chatId && (
                <button id="delete-chat-button" className="btn btn-outline-danger me-2" onClick={() => deleteChat(chatId)}>
                  <i className="bi bi-trash"></i>
                </button>
              )}
              <input
                type="text"
                id="user-input"
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button id="send-button" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default qwen;
