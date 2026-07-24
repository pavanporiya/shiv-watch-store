export default function Skeleton({
  height = 200,
  width = "100%",
  borderRadius = "12px",
  style = {},
  className = "",
}) {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        height,
        width,
        borderRadius,
        background: "linear-gradient(90deg, #18181c 25%, #24242c 50%, #18181c 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-card, #141417)",
        borderRadius: "var(--radius-lg, 16px)",
        padding: "16px",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "100%",
      }}
    >
      <Skeleton height={180} borderRadius="8px" />
      <Skeleton height={18} width="80%" borderRadius="4px" />
      <Skeleton height={14} width="40%" borderRadius="4px" />
      <Skeleton height={20} width="50%" borderRadius="4px" style={{ marginTop: "auto" }} />
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <Skeleton height={36} width="60%" borderRadius="6px" />
        <Skeleton height={36} width="40%" borderRadius="6px" />
      </div>
    </div>
  );
}