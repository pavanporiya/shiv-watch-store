import { useState, useEffect, useRef } from "react";

export default function ImageWithFallback({
  src,
  alt = "Watch image",
  className = "",
  style = {},
  loading = "lazy",
  decoding = "async",
  image2 = null,
  onClick,
  onKeyDown,
  tabIndex,
  role,
  ariaLabel,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  useEffect(() => {
    setError(false);
    setCurrentSrc(src);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    if (imgRef.current) {
      if (imgRef.current.complete) {
        if (imgRef.current.naturalWidth !== 0) {
          setLoaded(true);
        } else {
          setError(true);
          setLoaded(true);
        }
      }
    }
  }, [currentSrc]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    // If hover image failed, try reverting to main image
    if (currentSrc === image2 && src && currentSrc !== src) {
      setCurrentSrc(src);
    } else {
      setError(true);
      setLoaded(true);
    }
  };

  const handleMouseOver = () => {
    if (image2 && !error) {
      setCurrentSrc(image2);
    }
  };

  const handleMouseOut = () => {
    if (image2 && !error) {
      setCurrentSrc(src);
    }
  };

  if (error || !src) {
    return (
      <div
        className={`image-fallback ${className}`}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "160px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #18181c 0%, #101014 100%)",
          color: "var(--text-muted, #888)",
          borderRadius: "var(--radius-md, 8px)",
          padding: "16px",
          textAlign: "center",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
          ...style,
        }}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel || alt}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.6, marginBottom: "6px" }}
        >
          <circle cx="12" cy="12" r="7" />
          <polyline points="12 9 12 12 13.5 13.5" />
          <path d="M16.5 5.5L15 2H9L7.5 5.5" />
          <path d="M16.5 18.5L15 22H9L7.5 18.5" />
        </svg>
        <span style={{ fontSize: "11px", fontWeight: "500", opacity: 0.7 }}>
          {alt || "Image unavailable"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`img-fallback-wrapper ${className}`}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}
    >
      {!loaded && (
        <div
          className="img-skeleton-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, #18181c 25%, #222228 50%, #18181c 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            borderRadius: "inherit",
            zIndex: 1,
          }}
        />
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          display: "block",
        }}
      />
    </div>
  );
}
