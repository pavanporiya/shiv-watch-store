import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlistHelper } from "../utils/storage";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function Wishlist() {
  const [wishlist, setWishlistState] = useState([]);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setWishlistState(getWishlist());
  }, []);

  const requestRemoveItem = (item) => {
    setDeleteCandidate(item);
  };

  const confirmRemoveItem = () => {
    if (!deleteCandidate) return;

    setIsDeleting(true);
    setTimeout(() => {
      const updated = removeFromWishlistHelper(deleteCandidate.id);
      setWishlistState(updated);
      setToast({ message: `"${deleteCandidate.name}" removed from wishlist 🗑️`, type: "info" });
      setIsDeleting(false);
      setDeleteCandidate(null);
    }, 300);
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
              <img
                src={item.image}
                alt={item.name || "Wishlist item"}
                loading="lazy"
                decoding="async"
              />

              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <div className="actions">
                <button
                  onClick={() => navigate(`/product/${item.id}`)}
                  aria-label={`View ${item.name}`}
                >
                  View
                </button>

                <button
                  className="remove"
                  onClick={() => requestRemoveItem(item)}
                  disabled={isDeleting}
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Remove Item from Wishlist"
        message={deleteCandidate ? `Are you sure you want to remove "${deleteCandidate.name}" from your wishlist?` : ""}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemoveItem}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />

      {/* TOAST */}
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