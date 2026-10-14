// One cake card. It receives ONE cake (as a prop) and shows it.
function CakeCard({ cake, onAddToCart }) {
  return (
     <div className={cake.available ? "cake-card" : "cake-card sold"}>
      {/* Top: photo, or a cake emoji if there's no photo */}
      <div className="cake-image">
        {cake.imageUrl ? (
          <img src={cake.imageUrl} alt={cake.name} />
        ) : (
          <span className="cake-emoji">🎂</span>
        )}

        {/* Show "Sold out" badge only when the cake is not available */}
        {!cake.available && <span className="sold-out">Sold out</span>}
      </div>

      {/* Bottom: details */}
      <div className="cake-info">
        <span className="cake-category">{cake.category}</span>
        <h3>{cake.name}</h3>
        <p>{cake.description}</p>

        <div className="cake-bottom">
          <span className="cake-price">₹{cake.price}</span>
          <button disabled={!cake.available} onClick={() => onAddToCart(cake)}>
            {cake.available ? "Add to cart" : "Unavailable"}
          </button>
        </div>
      </div>

    </div>
  );
}

export default CakeCard;