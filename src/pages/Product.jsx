import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import products from "../data/products.json";
import { getData, setData } from "../utils/storage";
import { getWishlist, setWishlist } from "../utils/storage";
import Toast from "../components/Toast";

export default function Product() {

  const { id } = useParams();
  const product = products.find(p => p.id == id);

  const [toast, setToast] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return <h2>Product not found</h2>;

  // 👇 fallback if only one image
  const images = product.images || [product.image];

  // 🛒 ADD TO CART
  const addToCart = () => {
    let cart = getData("cart");
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    setData("cart", cart);
    setToast("Added to Cart");
  };

  // ❤️ WISHLIST
  const addToWishlist = () => {
    let wishlist = getWishlist();

    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      setToast("Already in Wishlist");
      return;
    }

    wishlist.push(product);
    setWishlist(wishlist);
    setToast("Added to Wishlist");
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
          <img src={images[activeImage]} />
        </div>

        <div className="thumbs">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
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

        <button onClick={addToCart}>Add to Cart</button>
        <button onClick={addToWishlist}>Add to Wishlist</button>

        {/* 🧠 REVIEWS */}
        <div className="reviews">
          <h3>Customer Reviews</h3>

          <div className="review">
            <p><strong>Rahul</strong></p>
            <p>⭐️⭐️⭐️⭐️⭐️ Amazing quality watch!</p>
          </div>

          <div className="review">
            <p><strong>Amit</strong></p>
            <p>⭐️⭐️⭐️⭐️ Worth the price.</p>
          </div>

        </div>

      </div>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}

    </motion.div>
  );
}