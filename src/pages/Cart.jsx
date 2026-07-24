import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartQtyHelper, removeFromCartHelper } from "../utils/storage";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import ImageWithFallback from "../components/ImageWithFallback";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import "../styles/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCartState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteCandidate, setDeleteCandidate] = useState(null); // item to delete
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setCartState(getCart());
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const total = cart.reduce((acc, item) => acc + (item.price || 0) * (item.qty || item.quantity || 1), 0);

  const handleIncreaseQty = (item) => {
    setActionLoadingId(`inc-${item.id}`);
    setTimeout(() => {
      const currentQty = item.qty || item.quantity || 1;
      const updated = updateCartQtyHelper(item.id, currentQty + 1);
      setCartState(updated);
      setActionLoadingId(null);
    }, 150);
  };

  const handleDecreaseQty = (item) => {
    const currentQty = item.qty || item.quantity || 1;
    if (currentQty <= 1) return;

    setActionLoadingId(`dec-${item.id}`);
    setTimeout(() => {
      const updated = updateCartQtyHelper(item.id, currentQty - 1);
      setCartState(updated);
      setActionLoadingId(null);
    }, 150);
  };

  const requestRemoveItem = (item) => {
    setDeleteCandidate(item);
  };

  const confirmRemoveItem = () => {
    if (!deleteCandidate) return;

    setIsDeleting(true);
    setTimeout(() => {
      const updated = removeFromCartHelper(deleteCandidate.id);
      setCartState(updated);
      setToast({ message: `"${deleteCandidate.name}" removed from cart 🗑️`, type: "info" });
      setIsDeleting(false);
      setDeleteCandidate(null);
    }, 300);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="cart-wrapper" style={{ padding: "40px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
          <Skeleton height={32} width="200px" borderRadius="6px" />
          <Skeleton height={100} borderRadius="12px" />
          <Skeleton height={100} borderRadius="12px" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty-container" style={{ padding: "60px 24px" }}>
        <EmptyState
          icon="🛒"
          title="Your Cart is Empty"
          description="Looks like you haven't added any watches to your cart yet. Explore our collection to find your favorite timepiece."
          actionText="Explore Watches"
          onAction={() => navigate("/shop")}
        />
      </div>
    );
  }

  return (
    <main id="main-content" className="cart-wrapper">
      <div className="cart-items-section">
        <h1>Your Cart</h1>

        {cart.map((item) => {
          const currentQty = item.qty || item.quantity || 1;
          const isIncLoading = actionLoadingId === `inc-${item.id}`;
          const isDecLoading = actionLoadingId === `dec-${item.id}`;

          return (
            <article key={item.id} className="cart-item">
              <div style={{ width: "90px", height: "90px", flexShrink: 0, borderRadius: "8px", overflow: "hidden" }}>
                <ImageWithFallback
                  src={item.image}
                  alt={item.name || "Cart item"}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="cart-info">
                <h2>{item.name}</h2>
                <p>₹{item.price}</p>

                <div className="qty-controls">
                  <button
                    type="button"
                    onClick={() => handleDecreaseQty(item)}
                    disabled={currentQty <= 1 || isDecLoading || isIncLoading}
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    -
                  </button>
                  <span>{currentQty}</span>
                  <button
                    type="button"
                    onClick={() => handleIncreaseQty(item)}
                    disabled={isIncLoading || isDecLoading}
                    aria-label={`Increase quantity for ${item.name}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => requestRemoveItem(item)}
                  disabled={isDeleting}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>

              <div className="item-total">₹{item.price * currentQty}</div>
            </article>
          );
        })}
      </div>

      <aside className="cart-summary" aria-label="Order summary">
        <h2>Order Summary</h2>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>

        <div className="summary-row">
          <span>Delivery</span>
          <span>Free</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button type="button" className="checkout-btn" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      </aside>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Remove Item from Cart"
        message={deleteCandidate ? `Are you sure you want to remove "${deleteCandidate.name}" from your cart?` : ""}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemoveItem}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
};

export default Cart;
