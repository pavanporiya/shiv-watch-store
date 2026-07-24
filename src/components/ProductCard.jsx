import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCartHelper } from "../utils/storage";
import Toast from "./Toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);

    setTimeout(() => {
      const res = addToCartHelper(product, 1);

      if (!res.success) {
        if (res.reason === "LOGIN_REQUIRED") {
          setToast({ message: "Please log in to add items ❌", type: "error" });
        } else {
          setToast({ message: res.message || "Failed to add ❌", type: "error" });
        }
      } else {
        setToast({ message: "Added to Cart ✅", type: "success" });
      }

      setIsAdding(false);
    }, 250);
  };

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* IMAGE WITH HOVER SWAP */}
      <img
        src={product.image}
        alt={product.name}
        onMouseOver={(e) => {
          if (product.image2) e.currentTarget.src = product.image2;
        }}
        onMouseOut={(e) => {
          e.currentTarget.src = product.image;
        }}
      />

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <button onClick={handleAddToCart} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}