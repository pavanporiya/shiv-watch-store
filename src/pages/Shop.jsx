import React, { useState, useEffect } from "react";
import productsData from "../data/products.json";
import "../styles/shop.css";
import "../styles/toast.css";
import { addToCartHelper } from "../utils/storage";
import Toast from "../components/Toast";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(50000);

  const [sortOption, setSortOption] = useState("");
  const [openPanel, setOpenPanel] = useState("category");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    setProducts(productsData);
  }, []);

  const categories = ["All", ...new Set(productsData.map((p) => p.category))];

  const togglePanel = (panel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  // ✅ ADD TO CART
  const addToCart = (product, img = null) => {
    if (addingProductId === product.id) return;
    setAddingProductId(product.id);

    setTimeout(() => {
      const res = addToCartHelper(product, 1);

      if (!res.success) {
        if (res.reason === "LOGIN_REQUIRED") {
          setToast({ message: "Please log in to add items to cart ❌", type: "error" });
        } else {
          setToast({ message: res.message || "Failed to add item ❌", type: "error" });
        }
      } else {
        setToast({ message: "Added to Cart ✅", type: "success" });
        if (img) animateToCart(img);
      }

      setAddingProductId(null);
    }, 250);
  };

  // ✅ ANIMATION
  const animateToCart = (img) => {
    const cartIcon = document.getElementById("cart-icon");
    if (!cartIcon || !img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const clone = img.cloneNode(true);
    clone.classList.add("flying-img");

    document.body.appendChild(clone);

    clone.style.left = imgRect.left + "px";
    clone.style.top = imgRect.top + "px";

    requestAnimationFrame(() => {
      clone.style.left = cartRect.left + "px";
      clone.style.top = cartRect.top + "px";
      clone.style.width = "20px";
      clone.style.height = "20px";
      clone.style.opacity = "0.5";
    });

    setTimeout(() => clone.remove(), 600);
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory,
    )
    .filter((p) => p.price <= maxPrice)
    .sort((a, b) => {
      if (sortOption === "low-high") return a.price - b.price;
      if (sortOption === "high-low") return b.price - a.price;
      return 0;
    });

  return (
    <>
      {/* 🔥 MAIN SHOP */}
      <div className="shop-container">
        {/* SIDEBAR */}
        <div className="shop-sidebar">
          <h2>Filters</h2>

          <div className="accordion">
            <div
              className={`accordion-header ${openPanel === "category" ? "open" : ""}`}
              onClick={() => togglePanel("category")}
            >
              Category <span>⌄</span>
            </div>

            <div
              className={`accordion-body ${openPanel === "category" ? "open" : ""}`}
            >
              <div className="category-buttons">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "active" : ""}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="accordion">
            <div
              className={`accordion-header ${openPanel === "price" ? "open" : ""}`}
              onClick={() => togglePanel("price")}
            >
              Price <span>⌄</span>
            </div>

            <div
              className={`accordion-body ${openPanel === "price" ? "open" : ""}`}
            >
              <div className="price-buttons">
                {[1000, 5000, 10000, 25000, 50000].map((price) => (
                  <button
                    key={price}
                    onClick={() => setMaxPrice(price)}
                    className={maxPrice === price ? "active" : ""}
                  >
                    Under ₹{price}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="shop-main">
          <div className="shop-topbar">
            <input
              type="text"
              placeholder="Search watches..."
              className="shop-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="shop-sort"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <div className="empty-icon">⌚</div>
              <h2>No watches found</h2>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map((product) => {
                const isAdding = addingProductId === product.id;
                return (
                  <div key={product.id} className="product-card">
                    <div className="image-wrapper">
                      <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-name">{product.name}</div>
                    <div className="product-category">{product.category}</div>
                    <div className="product-price">₹{product.price}</div>

                    <div className="card-actions">
                      <button
                        className="product-btn"
                        disabled={isAdding}
                        onClick={(e) => {
                          const img = e.currentTarget
                            .closest(".product-card")
                            .querySelector("img");

                          addToCart(product, img);
                        }}
                      >
                        {isAdding ? "Adding..." : "Add to Cart"}
                      </button>

                      <button
                        className="quick-view-btn"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* QUICK VIEW MODAL */}
        {selectedProduct && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedProduct(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span
                className="close-btn"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </span>

              <div className="modal-body">
                <img src={selectedProduct.image} alt={selectedProduct.name} />

                <div className="modal-info">
                  <h2>{selectedProduct.name}</h2>
                  <p className="modal-price">₹{selectedProduct.price}</p>

                  <button
                    className="product-btn"
                    disabled={addingProductId === selectedProduct.id}
                    onClick={() => addToCart(selectedProduct)}
                  >
                    {addingProductId === selectedProduct.id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default Shop;
