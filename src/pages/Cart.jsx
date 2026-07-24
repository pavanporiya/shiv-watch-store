import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartQtyHelper, removeFromCartHelper } from "../utils/storage";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import "../styles/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCartState] = useState([]);
  const [deleteCandidate, setDeleteCandidate] = useState(null); // item to delete
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    setCartState(getCart());
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * (item.qty || item.quantity || 1), 0);

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

  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-content fade-in">
          <div className="cart-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Start adding watches you like.</p>

          <button className="shop-btn" onClick={() => navigate("/shop")}>
            Explore Watches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-items-section">
        <h2>Your Cart</h2>

        {cart.map((item) => {
          const currentQty = item.qty || item.quantity || 1;
          const isIncLoading = actionLoadingId === `inc-${item.id}`;
          const isDecLoading = actionLoadingId === `dec-${item.id}`;

          return (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                <div className="qty-controls">
                  <button
                    onClick={() => handleDecreaseQty(item)}
                    disabled={currentQty <= 1 || isDecLoading || isIncLoading}
                  >
                    -
                  </button>
                  <span>{currentQty}</span>
                  <button
                    onClick={() => handleIncreaseQty(item)}
                    disabled={isIncLoading || isDecLoading}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => requestRemoveItem(item)}
                  disabled={isDeleting}
                >
                  Remove
                </button>
              </div>

              <div className="item-total">₹{item.price * currentQty}</div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>

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

        <button className="checkout-btn" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      </div>

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
    </div>
  );
};

export default Cart;
