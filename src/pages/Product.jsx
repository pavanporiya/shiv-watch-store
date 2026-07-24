import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import products from "../data/products.json";
import { addToCartHelper, addToWishlistHelper } from "../utils/storage";
import Toast from "../components/Toast";
import ImageWithFallback from "../components/ImageWithFallback";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import ProductCard from "../components/ProductCard";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isAddingWishlist, setIsAddingWishlist] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const found = products.find((p) => String(p.id) === String(id));
      setProduct(found || null);
      setActiveImage(0);
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="product-page product">
        <div className="product-container skeleton-layout">
          <div className="product-gallery">
            <Skeleton height={460} borderRadius="16px" style={{ marginBottom: "16px" }} />
            <div style={{ display: "flex", gap: "12px" }}>
              <Skeleton height={72} width={72} borderRadius="10px" />
              <Skeleton height={72} width={72} borderRadius="10px" />
              <Skeleton height={72} width={72} borderRadius="10px" />
            </div>
          </div>
          <div className="product-info">
            <Skeleton height={20} width="30%" borderRadius="4px" style={{ marginBottom: "12px" }} />
            <Skeleton height={38} width="80%" borderRadius="6px" style={{ marginBottom: "16px" }} />
            <Skeleton height={28} width="40%" borderRadius="6px" style={{ marginBottom: "20px" }} />
            <Skeleton height={18} width="35%" borderRadius="6px" style={{ marginBottom: "24px" }} />
            <Skeleton height={90} width="100%" borderRadius="8px" style={{ marginBottom: "32px" }} />
            <div style={{ display: "flex", gap: "14px" }}>
              <Skeleton height={48} width="50%" borderRadius="8px" />
              <Skeleton height={48} width="50%" borderRadius="8px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page product" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <EmptyState
            icon="🔍"
            title="Product not found"
            description="The watch you are looking for does not exist or may have been removed."
            actionText="Explore Collection"
            onAction={() => navigate("/shop")}
          />
        </div>
      </div>
    );
  }

  // fallback if only one image
  const images = product.images || [product.image];

  // Derive related products from same category or fallback to catalog
  const categoryRelated = products.filter(
    (p) => String(p.id) !== String(product.id) && p.category === product.category
  );
  const relatedProducts = (
    categoryRelated.length >= 2
      ? categoryRelated
      : products.filter((p) => String(p.id) !== String(product.id))
  ).slice(0, 4);

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
    <main id="main-content">
      <motion.div
        className="product-page product"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="product-container">
          {/* 🔥 IMAGE GALLERY WITH FALLBACK & HOVER ZOOM */}
          <div className="product-gallery">
            <div className="main-image">
              <ImageWithFallback
                src={images[activeImage]}
                alt={product.name || "Product image"}
                decoding="async"
              />
            </div>

            {images.length > 1 && (
              <div className="thumbs">
                {images.map((img, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`thumb-wrapper ${activeImage === index ? "active" : ""}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View thumbnail ${index + 1}`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name || "Product"} thumbnail ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 📄 PRODUCT INFO */}
          <div className="product-info">
            {(product.brand || product.category) && (
              <div className="product-eyebrow">
                {product.brand ? `${product.brand} • ${product.category || ""}` : product.category}
              </div>
            )}

            <h1 className="product-title">{product.name}</h1>

            <div className="product-price-row">
              <span className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <span className="product-original-price">
                  ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                </span>
              )}
              {product.stock > 0 && (
                <span className="stock-badge">
                  <span className="stock-dot"></span> In Stock
                </span>
              )}
            </div>

            {/* ⭐ RATING */}
            <div className="rating" aria-label="Rating: 4 out of 5 stars">
              <span className="stars" aria-hidden="true">⭐⭐⭐⭐☆</span>
              <span className="review-count">(124 reviews)</span>
            </div>

            <p className="desc">{product.description}</p>

            <div className="product-actions">
              <button
                type="button"
                className="btn-primary-action"
                onClick={handleAddToCart}
                disabled={isAddingCart}
                aria-label={`Add ${product.name} to cart`}
              >
                {isAddingCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                type="button"
                className="btn-secondary-action"
                onClick={handleAddToWishlist}
                disabled={isAddingWishlist}
                aria-label={`Add ${product.name} to wishlist`}
              >
                {isAddingWishlist ? "Adding..." : "Add to Wishlist"}
              </button>
            </div>

            {/* 🧠 REVIEWS */}
            <div className="reviews">
              <h2>Customer Reviews</h2>

              <article className="review">
                <p>
                  <strong>Rahul</strong>
                </p>
                <p>⭐️⭐️⭐️⭐️⭐️ Amazing quality watch!</p>
              </article>

              <article className="review">
                <p>
                  <strong>Amit</strong>
                </p>
                <p>⭐️⭐️⭐️⭐️ Worth the price.</p>
              </article>
            </div>
          </div>
        </div>

        {/* ⌚ RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="related-products" aria-label="Related Timepieces">
            <h2 className="related-title">Related Timepieces</h2>
            <div className="related-grid">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </motion.div>
    </main>
  );
}
