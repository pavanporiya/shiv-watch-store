import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../utils/storage";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // LOAD ORDERS FROM LOCALSTORAGE
  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrders());
    };

    loadOrders();

    // 🔥 listen for updates
    window.addEventListener("ordersUpdated", loadOrders);

    return () => {
      window.removeEventListener("ordersUpdated", loadOrders);
    };
  }, []);

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="empty-state" style={{ marginTop: "40px" }}>
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start exploring our watch collection.</p>
          <button onClick={() => navigate("/shop")}>
            Explore Watches
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.id}>
            {/* HEADER */}
            <div className="order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p>{order.date}</p>
              </div>

              <span className="status">{order.status || "Order Received"}</span>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items && order.items.map((item, i) => (
                <div className="order-item" key={item.id || i}>
                  <img
                    src={item.image}
                    alt={item.name || "Ordered watch"}
                    loading="lazy"
                    decoding="async"
                  />

                  <div>
                    <p>{item.name}</p>
                    <span>Qty: {item.qty || item.quantity || 1}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="order-footer">Total: ₹{order.total}</div>
          </div>
        ))
      )}
    </div>
  );
}
