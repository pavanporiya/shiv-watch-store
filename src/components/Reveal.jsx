import { useEffect, useRef, useState } from "react";

export default function Reveal({ children }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transform: visible ? "translateY(0px)" : "translateY(60px)",
        opacity: visible ? 1 : 0,
        transition: "all 0.8s ease",
      }}
    >
      {children}
    </div>
  );
}