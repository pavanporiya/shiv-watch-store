import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUser, logout } from "../utils/storage";

export default function Navbar() {
  // ✅ Initialize once
  const [user, setUser] = useState(() => getUser());
  const navigate = useNavigate();

  // ✅ Logout handler (proper state update)
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="nav-container">
      <Link to="/" className="logo">
        Shiv Watch
      </Link>

      <div className="nav-items">
        <Link to="/" className="nav-link">
          Home
        </Link>

        <Link to="/shop" className="nav-link">
          Shop
        </Link>

        {user && (
          <>
            <Link to="/cart" className="nav-link">
              Cart
            </Link>

            <Link to="/wishlist" className="nav-link">
              Wishlist
            </Link>

            <Link to="/orders" className="nav-link">
              Orders
            </Link>
          </>
        )}

        {!user ? (
          <Link to="/auth" className="nav-link">
            Login
          </Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}