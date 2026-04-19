import { useEffect, useState } from "react";

export default function PageWrapper({ children }) {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    return () => {
      setVisible(false);
    };
  }, []);

  return (
    <div className={`page ${visible ? "show" : ""}`}>
      {children}
    </div>
  );
}