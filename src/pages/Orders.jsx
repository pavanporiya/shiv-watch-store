import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // LOAD ORDERS FROM LOCALSTORAGE
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div className="orders-container">

      <h1>Your Orders</h1>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <p style={{ color: "#aaa", marginTop: "20px" }}>
          No orders yet
        </p>
      ) : (

        orders.map((order) => (
          <div className="order-card" key={order.id}>

            {/* HEADER */}
            <div className="order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p>{order.date}</p>
              </div>

              <span className="status">Delivered</span>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <img src={item.image} alt={item.name} />

                  <div>
                    <p>{item.name}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="order-footer">
              Total: ₹{order.total}
            </div>

          </div>
        ))

      )}

    </div>
  );
}