import { useNavigate } from "react-router-dom";
import { getData, setData } from "../utils/storage";

export default function ProductCard({ product }) {

  const navigate = useNavigate();

  const addToCart = (e) => {
    e.stopPropagation();

    let cart = getData("cart");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    setData("cart", cart);
    alert("Added to cart");
  };

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product.id}`)}
    >

      {/* IMAGE WITH HOVER SWAP */}
      <img
        src={product.image}
        onMouseOver={(e) => {
          if (product.image2) e.currentTarget.src = product.image2;
        }}
        onMouseOut={(e) => {
          e.currentTarget.src = product.image;
        }}
      />

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <button onClick={addToCart}>
        Add to Cart
      </button>

    </div>
  );
}