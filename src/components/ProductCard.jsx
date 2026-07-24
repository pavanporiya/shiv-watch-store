import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { addToCartHelper } from "../utils/storage";
import Toast from "./Toast";
import ImageWithFallback from "./ImageWithFallback";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);

  if (!product) return null;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      handleCardClick();
    }
  };

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
    <article
      className="card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
    >
      {/* IMAGE WITH HOVER SWAP AND FALLBACK */}
      <div className="image-wrapper" style={{ width: "100%", height: "180px" }}>
        <ImageWithFallback
          src={product.image}
          image2={product.image2}
          alt={product.name || "Watch image"}
          loading="lazy"
          decoding="async"
        />
      </div>

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <button
        type="button"
        className="product-btn"
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
    </article>
  );
}

export default memo(ProductCard);