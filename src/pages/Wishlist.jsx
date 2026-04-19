import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(data);
  }, []);

  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="wishlist-container">

      

      {wishlist.length === 0 ? (
        <div className="empty-state">

          <div className="empty-icon">♡</div>

          <h2>Your wishlist is empty</h2>

          <p>Save items you love to your wishlist and revisit them anytime.</p>

          <button onClick={() => navigate("/shop")}>
            Explore Products
          </button>

        </div>
      ) : (

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div className="wishlist-card" key={item.id}>

              <img src={item.image} alt={item.name} />

              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <div className="actions">
                <button onClick={() => navigate("/shop")}>
                  View
                </button>

                <button
                  className="remove"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
}