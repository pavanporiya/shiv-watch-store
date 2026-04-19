import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, setCart } from "../utils/storage";
import "../styles/cart.css";
import { getOrders, setOrders } from "../utils/storage";
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCartState] = useState([]);
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: total,
      date: new Date().toLocaleString(),
      status: "Order Received",
    };
    
    let orders = getOrders();
    orders.push(newOrder);
    setOrders(orders);

    window.dispatchEvent(new Event("ordersUpdated"));
    
    // 🔥 CLEAR CART
    setCart([]);
    setCartState([]);

    
    
    // 🔥 FAKE STATUS UPDATE
    setTimeout(() => updateOrderStatus(newOrder.id, "Out for Delivery"), 5000);
    setTimeout(() => updateOrderStatus(newOrder.id, "Delivered"), 10000);

    alert("Order Placed ✅");
  };
  const updateOrderStatus = (orderId, newStatus) => {
    let orders = getOrders();

    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order,
    );

    setOrders(updated);
  };
  // 🔥 FIX: always load correct user cart
  useEffect(() => {
    setCartState(getCart());
  }, []);

  const updateCart = (updatedCart) => {
    setCartState(updatedCart);
    setCart(updatedCart);
  };

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty += 1;
    updateCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cart];
    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
      updateCart(updated);
    }
  };

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    updateCart(updated);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

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

        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.name} />

            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <div className="qty-controls">
                <button onClick={() => decreaseQty(index)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(index)}>+</button>
              </div>

              <button className="remove-btn" onClick={() => removeItem(index)}>
                Remove
              </button>
            </div>

            <div className="item-total">₹{item.price * item.qty}</div>
          </div>
        ))}
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

        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
