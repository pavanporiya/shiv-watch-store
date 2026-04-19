import { useEffect } from "react";

export default function Toast({ message, type, onClose }) {

  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
}