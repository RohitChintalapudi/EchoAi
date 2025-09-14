import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown"; // <-- import
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function getAnswer() {
    if (!input.trim()) return;

    const userMessage = input; 
    setInput(""); 
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: userMessage,
      });

      const aiText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: userMessage },
        { sender: "ai", text: aiText },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Could not fetch response." },
      ]);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="app">
      <h1>✨EchoAI Chatbot✨</h1>
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={m.sender}>
            <strong>{m.sender === "user" ? "You" : "AI"}:</strong>{" "}
            {m.sender === "ai" ? (
              <ReactMarkdown>{m.text}</ReactMarkdown>
            ) : (
              m.text
            )}
          </div>
        ))}
        {loading && (
          <p>
            <em>AI is typing...</em>
          </p>
        )}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && getAnswer()}
        />
        <button onClick={getAnswer}>Send</button>
      </div>
    </div>
  );
}
export default App;
