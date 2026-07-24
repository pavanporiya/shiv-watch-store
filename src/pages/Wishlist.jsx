import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlistHelper } from "../utils/storage";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import ImageWithFallback from "../components/ImageWithFallback";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

export default function Wishlist() {
  const [wishlist, setWishlistState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setWishlistState(getWishlist());
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
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
    <main id="main-content" className="wishlist-container">
      <h1 className="sr-only">Your Wishlist</h1>
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          <Skeleton height={280} borderRadius="12px" />
          <Skeleton height={280} borderRadius="12px" />
          <Skeleton height={280} borderRadius="12px" />
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon="♡"
          title="Your Wishlist is Empty"
          description="Save items you love to your wishlist and revisit them anytime."
          actionText="Explore Collection"
          onAction={() => navigate("/shop")}
        />
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <article className="wishlist-card" key={item.id}>
              <div style={{ width: "100%", height: "180px", borderRadius: "8px", overflow: "hidden" }}>
                <ImageWithFallback
                  src={item.image}
                  alt={item.name || "Wishlist item"}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <h2>{item.name}</h2>
              <p>₹{item.price}</p>

              <div className="actions">
                <button
                  type="button"
                  onClick={() => navigate(`/product/${item.id}`)}
                  aria-label={`View ${item.name}`}
                  disabled={isDeleting}
                >
                  View
                </button>

                <button
                  type="button"
                  className="remove"
                  onClick={() => requestRemoveItem(item)}
                  disabled={isDeleting}
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  Remove
                </button>
              </div>
            </article>
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
    </main>
  );
}