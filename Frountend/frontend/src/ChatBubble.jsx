import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { sendChatMessage } from "./api";

const WELCOME = {
  role: "bot",
  text: "Hi! 👋 I'm the Geethu's Corner cake assistant. " +
        "Ask me about our cakes, prices, delivery or custom cakes.",
};

// Quick questions shown at the start
const QUICK_QUESTIONS = ["What cakes do you have today?", "Do you deliver?", "How do custom cakes work?"];

function ChatBubble({ user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);   // an invisible marker at the bottom of the messages

  // Scroll down to the newest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send one question and add both sides to the chat
  async function ask(question) {
    if (!question || loading) return;

    setMessages((current) => [...current, { role: "user", text: question }]);
    setText("");
    setLoading(true);

    try {
      const data = await sendChatMessage(question);
      setMessages((current) => [...current, { role: "bot", text: data.response }]);
    } catch (err) {
      setMessages((current) => [...current, { role: "bot", text: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    ask(text.trim());
  }

  return (
    <div className="chat">
      {open && (
        <section className="chat-panel" aria-label="Cake assistant">
          <header className="chat-header">
            <strong>Cake assistant 🎂</strong>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </header>

          {user ? (
            <>
              <div className="chat-messages">
                {messages.map((m, index) => (
                  <p key={index} className={`chat-msg ${m.role}`}>{m.text}</p>
                ))}

                {/* Quick questions, only before the first question */}
                {messages.length === 1 && (
                  <div className="chat-quick">
                    {QUICK_QUESTIONS.map((q) => (
                      <button key={q} onClick={() => ask(q)}>{q}</button>
                    ))}
                  </div>
                )}

                {loading && <p className="chat-msg bot typing">Typing...</p>}
                <div ref={endRef} />
              </div>

              <form className="chat-form" onSubmit={handleSubmit}>
                <input value={text} onChange={(e) => setText(e.target.value)} maxLength={500}
                       placeholder="Ask about cakes..." aria-label="Your question" />
                <button type="submit" disabled={loading || !text.trim()}>Send</button>
              </form>
            </>
          ) : (
            <p className="chat-login">
              Please <Link to="/login" onClick={() => setOpen(false)}>log in</Link> to chat with our cake assistant.
            </p>
          )}
        </section>
      )}

      <button className="chat-toggle" onClick={() => setOpen(!open)}
              aria-label={open ? "Close chat" : "Open chat"}>
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

export default ChatBubble;
