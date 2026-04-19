import { useState } from "react";
import { getData, setData } from "../utils/storage";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const navigate = useNavigate();
  const cart = getData("cart");

  const handleOrder = () => {
    if (!form.name || !form.address || !form.phone) {
      alert("Fill all fields");
      return;
    }

    const orders = getData("orders");

    const newOrder = {
      id: Date.now(),
      items: cart,
      user: form,
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      date: new Date().toLocaleString()
    };

    orders.push(newOrder);

    setData("orders", orders);
    setData("cart", []); // clear cart

    alert("Order placed successfully!");
    navigate("/orders");
  };

  if (cart.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div>
      <h2>Checkout</h2>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <input
        placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button onClick={handleOrder}>Place Order</button>
    </div>
  );
}