import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, createOrderHelper } from "../utils/storage";
import Toast from "../components/Toast";

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [cart, setCartState] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setCartState(getCart());
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * (item.qty || item.quantity || 1), 0);

  const handleOrder = (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = form.name.trim();
    const trimmedAddress = form.address.trim();
    const trimmedPhone = form.phone.trim();

    if (!trimmedName || !trimmedAddress || !trimmedPhone) {
      setToast({ message: "Please fill in all fields ⚠️", type: "error" });
      return;
    }

    const phoneRegex = /^[0-9+\s-]{7,15}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setToast({ message: "Please enter a valid phone number ⚠️", type: "error" });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = createOrderHelper({
        name: trimmedName,
        address: trimmedAddress,
        phone: trimmedPhone,
      });

      if (result.success) {
        setToast({ message: "Order placed successfully! 🎉", type: "success" });
        setTimeout(() => {
          setIsSubmitting(false);
          navigate("/orders");
        }, 800);
      } else {
        setIsSubmitting(false);
        setToast({ message: result.message || "Failed to place order ❌", type: "error" });
      }
    }, 500);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-content fade-in">
          <div className="cart-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Add watches to your cart before proceeding to checkout.</p>
          <button className="shop-btn" onClick={() => navigate("/shop")}>
            Explore Watches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <form onSubmit={handleOrder} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          type="text"
          placeholder="Full Name"
          aria-label="Full Name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={isSubmitting}
          required
        />

        <input
          type="text"
          placeholder="Delivery Address"
          aria-label="Delivery Address"
          autoComplete="street-address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          disabled={isSubmitting}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          aria-label="Phone Number"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          disabled={isSubmitting}
          required
        />

        <div style={{ marginTop: "12px", fontSize: "16px", fontWeight: "600" }}>
          Total Amount: ₹{total}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>

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