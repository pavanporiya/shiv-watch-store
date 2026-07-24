import { useEffect } from "react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2400);
    return () => clearTimeout(timer);
  }, [onClose]);

  const cleanMessage = typeof message === "string"
    ? message.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✅❌🎉⚠️🗑️❤️]/gu, "").trim()
    : message;

  const symbol = type === "error" ? "✕" : type === "info" ? "i" : "✓";

  return (
    <div className={`toast ${type || ""}`} role="status" aria-live="polite">
      <span className="toast-icon">{symbol}</span>
      <span className="toast-message">{cleanMessage}</span>
    </div>
  );
}