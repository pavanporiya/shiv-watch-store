import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser, logout } from "../utils/storage";

export default function Navbar() {
  const [user, setUser] = useState(getUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🔥 FIX: Listen for login/logout changes
  useEffect(() => {
    const updateUser = () => {
      setUser(getUser());
    };

    window.addEventListener("userChanged", updateUser);

    return () => {
      window.removeEventListener("userChanged", updateUser);
    };
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="nav-container">
      <Link to="/" className="logo" onClick={closeMenu}>
        Shiv Watch
      </Link>

      <button 
        className={`hamburger-btn ${menuOpen ? "open" : ""}`} 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="nav-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div id="nav-menu" className={`nav-items ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/shop" className="nav-link" onClick={closeMenu}>Shop</Link>

        {user && (
          <>
            <Link to="/cart" id="cart-icon" className="nav-link" onClick={closeMenu}>Cart</Link>
            <Link to="/orders" className="nav-link" onClick={closeMenu}>Orders</Link>
          </>
        )}

        {!user ? (
          <Link to="/auth" className="nav-link" onClick={closeMenu}>Login</Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}