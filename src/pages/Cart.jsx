import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 🔥 UPDATE LOCAL STORAGE
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🔥 INCREASE QTY
  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty += 1;
    updateCart(updated);
  };

  // 🔥 DECREASE QTY
  const decreaseQty = (index) => {
    const updated = [...cart];
    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
      updateCart(updated);
    }
  };

  // 🔥 REMOVE ITEM
  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    updateCart(updated);
  };

  // 🔥 TOTAL
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 🔥 EMPTY STATE
  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-content fade-in">
          <div className="cart-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Start adding watches you like.</p>

          <button
            className="shop-btn"
            onClick={() => navigate("/shop")}
          >
            Explore Watches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">

      {/* LEFT - ITEMS */}
      <div className="cart-items-section">

        <h2>Your Cart</h2>

        {cart.map((item, index) => (
          <div key={index} className="cart-item">

            <img src={item.image} alt={item.name} />

            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              {/* QTY CONTROLS */}
              <div className="qty-controls">
                <button onClick={() => decreaseQty(index)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(index)}>+</button>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </div>

            <div className="item-total">
              ₹{item.price * item.qty}
            </div>

          </div>
        ))}

      </div>

      {/* RIGHT - SUMMARY */}
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

        <button className="checkout-btn">
          Proceed to Checkout
        </button>

      </div>

    </div>
  );
};

export default Cart;