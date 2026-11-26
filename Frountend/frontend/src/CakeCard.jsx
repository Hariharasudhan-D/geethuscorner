import { useState } from "react";

function getPhoto(imageUrl) {
  const url = URL.canParse(imageUrl) ? new URL(imageUrl) : null;
  if (url?.protocol !== "https:" || url.username || url.password) return null;

  const thumbnail = url.pathname.match(/^(.*\/thumb\/.*\/)(\d+)px-([^/]+)$/);
  if (!["thumb.wikimedia.org", "upload.wikimedia.org"].includes(url.hostname) || !thumbnail) {
    return { src: url.href };
  }

  const [, path, width, filename] = thumbnail;
  const widths = [330, 500].filter((size) => size < Number(width));
  return {
    src: url.href,
    srcSet: widths.length
      ? [...widths.map((size) => `${url.origin}${path}${size}px-${filename} ${size}w`), `${url.href} ${width}w`].join(", ")
      : undefined,
  };
}

function CakePhoto({ cake, featured }) {
  const photo = getPhoto(cake.imageUrl);
  const [source, setSource] = useState("responsive");

  if (!photo || source === "placeholder") {
    return <span className="cake-emoji" aria-hidden="true">🎂</span>;
  }

  const srcSet = source === "responsive" ? photo.srcSet : undefined;
  return (
    <img
      src={photo.src}
      srcSet={srcSet}
      sizes={srcSet ? "(max-width: 587px) calc(100vw - 40px), (max-width: 875px) calc((100vw - 68px) / 2), (max-width: 1163px) calc((100vw - 96px) / 3), 280px" : undefined}
      alt={cake.name}
      loading={featured ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setSource(srcSet ? "original" : "placeholder")}
    />
  );
}

// One cake card. It receives ONE cake (as a prop) and shows it.
function CakeCard({ cake, onAddToCart, rating, featured }) {
  return (
     <div className={cake.available ? "cake-card" : "cake-card sold"}>
      {/* Top: photo, or a cake emoji if there's no photo */}
      <div className="cake-image">
        <CakePhoto key={cake.imageUrl} cake={cake} featured={featured} />

        {/* Show "Sold out" badge only when the cake is not available */}
        {!cake.available && <span className="sold-out">Sold out</span>}
      </div>

      {/* Bottom: details */}
      <div className="cake-info">
        <span className="cake-category">{cake.category}</span>
        {rating && <span className="cake-rating">★ {rating.average} ({rating.count})</span>}
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
