// src/pages/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "../styles/CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-container">
        <h2>Your Shopping Cart is empty.</h2>
        <p>Check your Saved for later items below or continue shopping.</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-left-section">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <span className="price-header">Price</span>
        </div>
        <hr />

        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="cart-item-details">
              <Link
                to={`/product/${item.category}/${item.id}`}
                className="item-title"
              >
                {item.title}
              </Link>
              <p className="item-stock">In Stock</p>
              <div className="item-actions">
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.id,
                      parseInt(e.target.value) - item.quantity,
                    )
                  }
                  className="qty-select"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      Qty: {num}
                    </option>
                  ))}
                </select>
                <div className="separator">|</div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="action-link"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="cart-item-price">
              <strong>₹{item.price}</strong>
            </div>
          </div>
        ))}

        <div className="cart-subtotal-bar">
          <span className="subtotal-label">Subtotal ({cartCount} items): </span>
          <span className="subtotal-amount">₹{cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="cart-right-section">
        <div className="checkout-box">
          <div className="subtotal-section">
            <span className="subtotal-label">
              Subtotal ({cartCount} items):{" "}
            </span>
            <span className="subtotal-amount">₹{cartTotal.toFixed(2)}</span>
          </div>
          <button className="proceed-to-buy-btn">Proceed to Buy</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
