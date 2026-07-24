import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../utils/storage";
import ImageWithFallback from "../components/ImageWithFallback";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // LOAD ORDERS FROM LOCALSTORAGE
  useEffect(() => {
    const loadOrders = () => {
      setIsLoading(true);
      setTimeout(() => {
        setOrders(getOrders());
        setIsLoading(false);
      }, 200);
    };

    loadOrders();

    // 🔥 listen for updates
    window.addEventListener("ordersUpdated", loadOrders);

    return () => {
      window.removeEventListener("ordersUpdated", loadOrders);
    };
  }, []);

  return (
    <main id="main-content" className="orders-container">
      <h1>Your Orders</h1>

      {/* LOADING SKELETON */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
          <Skeleton height={140} borderRadius="12px" />
          <Skeleton height={140} borderRadius="12px" />
        </div>
      ) : orders.length === 0 ? (
        /* EMPTY STATE */
        <EmptyState
          icon="📦"
          title="No Orders Placed Yet"
          description="Your order history is currently empty. Explore our watch collection to place your first order."
          actionText="Start Shopping"
          onAction={() => navigate("/shop")}
        />
      ) : (
        /* ORDERS LIST */
        orders.map((order) => (
          <article className="order-card" key={order.id}>
            {/* HEADER */}
            <div className="order-header">
              <div>
                <h2>Order #{order.id}</h2>
                <p>{order.date}</p>
              </div>

              <span className="status">{order.status || "Order Received"}</span>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items &&
                order.items.map((item, i) => (
                  <div className="order-item" key={item.id || i}>
                    <div style={{ width: "60px", height: "60px", borderRadius: "6px", overflow: "hidden", flexShrink: 0 }}>
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name || "Ordered watch"}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div>
                      <p>{item.name}</p>
                      <span>Qty: {item.qty || item.quantity || 1}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* FOOTER */}
            <div className="order-footer">Total: ₹{order.total}</div>
          </article>
        ))
      )}
    </main>
  );
}
