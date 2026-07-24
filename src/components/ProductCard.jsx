import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCartHelper } from "../utils/storage";
import Toast from "./Toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);

  if (!product) return null;

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

  const handleMouseOver = (e) => {
    if (product.image2) {
      e.currentTarget.src = product.image2;
    }
  };

  const handleMouseOut = (e) => {
    if (product.image) {
      e.currentTarget.src = product.image;
    }
  };

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product.id}`)}
      role="article"
    >
      {/* IMAGE WITH HOVER SWAP */}
      <img
        src={product.image}
        alt={product.name || "Watch image"}
        loading="lazy"
        decoding="async"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        aria-label={`Add ${product.name || "item"} to cart`}
      >
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