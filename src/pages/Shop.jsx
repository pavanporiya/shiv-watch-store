import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import productsData from "../data/products.json";
import "../styles/shop.css";
import "../styles/toast.css";
import { addToCartHelper } from "../utils/storage";
import Toast from "../components/Toast";
import ImageWithFallback from "../components/ImageWithFallback";
import EmptyState from "../components/EmptyState";
import { ProductCardSkeleton } from "../components/Skeleton";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(50000);

  const [sortOption, setSortOption] = useState("");
  const [openPanel, setOpenPanel] = useState("category");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);

  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);
      const timer = setTimeout(() => {
        setProducts(productsData || []);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } catch {
      setError("Failed to load watch catalog. Please try refreshing.");
      setIsLoading(false);
    }
  }, []);

  // Modal accessibility effect (focus trap, ESC close, scroll lock, focus restore)
  useEffect(() => {
    if (!selectedProduct) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const previouslyFocused = document.activeElement;

    setTimeout(() => {
      if (modalRef.current) {
        const closeBtn = modalRef.current.querySelector(".close-btn");
        if (closeBtn) closeBtn.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedProduct(null);
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusables.length === 0) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [selectedProduct]);

  const categories = useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return ["All"];
    return ["All", ...new Set(productsData.map((p) => p.category))];
  }, []);

  const togglePanel = useCallback((panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("All");
    setMaxPrice(50000);
    setSortOption("");
  }, []);

  const addToCart = useCallback((product, img = null) => {
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
  }, [addingProductId]);

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

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase().trim()))
      .filter((p) =>
        selectedCategory === "All" ? true : p.category === selectedCategory,
      )
      .filter((p) => p.price <= maxPrice)
      .sort((a, b) => {
        if (sortOption === "low-high") return a.price - b.price;
        if (sortOption === "high-low") return b.price - a.price;
        return 0;
      });
  }, [products, search, selectedCategory, maxPrice, sortOption]);

  const renderEmptyState = () => {
    if (search.trim()) {
      return (
        <EmptyState
          icon="🔍"
          title="No search results found"
          description={`We couldn't find any watches matching "${search}". Check for spelling or try searching another keyword.`}
          actionText="Clear Search"
          onAction={() => setSearch("")}
          secondaryActionText="Reset All Filters"
          onSecondaryAction={handleResetFilters}
        />
      );
    }

    if (selectedCategory !== "All" || maxPrice < 50000) {
      return (
        <EmptyState
          icon="⚙️"
          title="No watches in selected filter range"
          description="Try broadening your category selection or increasing the maximum price range."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      );
    }

    return (
      <EmptyState
        icon="⌚"
        title="No watches available"
        description="Our catalog is currently empty. Please check back later."
      />
    );
  };

  return (
    <>
      <main id="main-content" className="shop-container">
        <h1 className="sr-only">Watch Catalog</h1>

        {/* SIDEBAR */}
        <aside className="shop-sidebar" aria-label="Filters">
          <h2>Filters</h2>

          <div className="accordion">
            <button
              type="button"
              className={`accordion-header ${openPanel === "category" ? "open" : ""}`}
              onClick={() => togglePanel("category")}
              aria-expanded={openPanel === "category"}
            >
              Category <span>⌄</span>
            </button>

            <div
              className={`accordion-body ${openPanel === "category" ? "open" : ""}`}
            >
              <div className="category-buttons">
                {categories.map((cat) => (
                  <button
                    type="button"
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
            <button
              type="button"
              className={`accordion-header ${openPanel === "price" ? "open" : ""}`}
              onClick={() => togglePanel("price")}
              aria-expanded={openPanel === "price"}
            >
              Price <span>⌄</span>
            </button>

            <div
              className={`accordion-body ${openPanel === "price" ? "open" : ""}`}
            >
              <div className="price-buttons">
                {[1000, 5000, 10000, 25000, 50000].map((price) => (
                  <button
                    type="button"
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
        </aside>

        {/* MAIN */}
        <section className="shop-main" aria-label="Products">
          <div className="shop-topbar">
            <label htmlFor="shop-search-input" className="sr-only">Search watches</label>
            <input
              id="shop-search-input"
              type="text"
              placeholder="Search watches..."
              className="shop-search"
              aria-label="Search watches"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label htmlFor="shop-sort-select" className="sr-only">Sort watches</label>
            <select
              id="shop-sort-select"
              className="shop-sort"
              aria-label="Sort watches"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>

          {/* ERROR STATE */}
          {error ? (
            <EmptyState
              icon="⚠️"
              title="Unable to load catalog"
              description={error}
              actionText="Retry"
              onAction={() => {
                setError(null);
                setIsLoading(true);
                setTimeout(() => {
                  setProducts(productsData || []);
                  setIsLoading(false);
                }, 300);
              }}
            />
          ) : isLoading ? (
            /* LOADING STATE - SKELETON GRID */
            <div className="shop-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* EMPTY STATE */
            renderEmptyState()
          ) : (
            /* PRODUCTS GRID */
            <div className="shop-grid">
              {filteredProducts.map((product) => {
                const isAdding = addingProductId === product.id;
                return (
                  <article key={product.id} className="product-card">
                    <div className="image-wrapper">
                      <ImageWithFallback
                        src={product.image}
                        image2={product.image2}
                        alt={product.name || "Watch image"}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="product-name">{product.name}</div>
                    <div className="product-category">{product.category}</div>
                    <div className="product-price">₹{product.price}</div>

                    <div className="card-actions">
                      <button
                        type="button"
                        className="product-btn"
                        disabled={isAdding}
                        aria-label={`Add ${product.name} to cart`}
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
                        type="button"
                        className="quick-view-btn"
                        aria-label={`Quick view ${product.name}`}
                        onClick={(e) => {
                          triggerRef.current = e.currentTarget;
                          setSelectedProduct(product);
                        }}
                      >
                        Quick View
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* QUICK VIEW MODAL */}
        {selectedProduct && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedProduct(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
          >
            <div
              ref={modalRef}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="close-btn"
                aria-label="Close modal"
                onClick={() => setSelectedProduct(null)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="modal-body">
                <div className="modal-image-container">
                  <ImageWithFallback
                    src={selectedProduct.image}
                    image2={selectedProduct.image2}
                    alt={selectedProduct.name || "Watch preview"}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="modal-info">
                  {selectedProduct.brand && (
                    <span className="modal-brand">{selectedProduct.brand}</span>
                  )}
                  <h2 id="quick-view-title" className="modal-title">{selectedProduct.name}</h2>
                  {selectedProduct.category && (
                    <span className="modal-category">{selectedProduct.category}</span>
                  )}

                  <div className="modal-price-wrap">
                    <span className="modal-price">₹{selectedProduct.price?.toLocaleString()}</span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="modal-original-price">₹{selectedProduct.originalPrice?.toLocaleString()}</span>
                    )}
                  </div>

                  {selectedProduct.description && (
                    <p className="modal-desc">{selectedProduct.description}</p>
                  )}

                  <div className="modal-availability">
                    <span className={`modal-stock-badge ${selectedProduct.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                      <span className="stock-dot"></span>
                      {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="modal-add-btn product-btn"
                    disabled={addingProductId === selectedProduct.id || selectedProduct.stock === 0}
                    aria-label={`Add ${selectedProduct.name} to cart`}
                    onClick={() => addToCart(selectedProduct)}
                  >
                    {addingProductId === selectedProduct.id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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
