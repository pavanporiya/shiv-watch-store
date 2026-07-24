import { useParams } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import products from "../data/products.json";
import { addToCartHelper, addToWishlistHelper } from "../utils/storage";
import Toast from "../components/Toast";

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === String(id));

  const [toast, setToast] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isAddingWishlist, setIsAddingWishlist] = useState(false);

  if (!product) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-content fade-in">
          <h1>Product not found</h1>
        </div>
      </div>
    );
  }

  // 👇 fallback if only one image
  const images = product.images || [product.image];

  // 🛒 ADD TO CART
  const handleAddToCart = () => {
    if (isAddingCart) return;
    setIsAddingCart(true);

    setTimeout(() => {
      const res = addToCartHelper(product, 1);

      if (!res.success) {
        if (res.reason === "LOGIN_REQUIRED") {
          setToast({ message: "Please login to add items to cart ❌", type: "error" });
        } else {
          setToast({ message: res.message || "Could not add to cart ❌", type: "error" });
        }
      } else {
        setToast({ message: "Added to Cart ✅", type: "success" });
      }

      setIsAddingCart(false);
    }, 300);
  };

  // ❤️ WISHLIST
  const handleAddToWishlist = () => {
    if (isAddingWishlist) return;
    setIsAddingWishlist(true);

    setTimeout(() => {
      const res = addToWishlistHelper(product);

      if (!res.success) {
        setToast({ message: res.message || "Already in Wishlist ⚠️", type: "info" });
      } else {
        setToast({ message: "Added to Wishlist ❤️", type: "success" });
      }

      setIsAddingWishlist(false);
    }, 300);
  };

  return (
    <motion.div
      className="product"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 🔥 IMAGE GALLERY */}
      <div>
        <div className="main-image">
          <img src={images[activeImage]} alt={product.name} />
        </div>

        <div className="thumbs">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} ${index + 1}`}
              onClick={() => setActiveImage(index)}
              className={activeImage === index ? "active" : ""}
            />
          ))}
        </div>
      </div>

      {/* 📄 PRODUCT INFO */}
      <div className="product-info">
        <h2>{product.name}</h2>

        <p className="price">₹{product.price}</p>

        {/* ⭐ RATING */}
        <div className="rating">
          ⭐⭐⭐⭐☆ <span>(124 reviews)</span>
        </div>

        <p className="desc">{product.description}</p>

        <button onClick={handleAddToCart} disabled={isAddingCart}>
          {isAddingCart ? "Adding..." : "Add to Cart"}
        </button>

        <button onClick={handleAddToWishlist} disabled={isAddingWishlist}>
          {isAddingWishlist ? "Adding..." : "Add to Wishlist"}
        </button>

        {/* 🧠 REVIEWS */}
        <div className="reviews">
          <h3>Customer Reviews</h3>

          <div className="review">
            <p>
              <strong>Rahul</strong>
            </p>
            <p>⭐️⭐️⭐️⭐️⭐️ Amazing quality watch!</p>
          </div>

          <div className="review">
            <p>
              <strong>Amit</strong>
            </p>
            <p>⭐️⭐️⭐️⭐️ Worth the price.</p>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
}
