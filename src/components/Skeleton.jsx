export default function Skeleton({ height = 200 }) {
  return (
    <div
      style={{
        height,
        borderRadius: "12px",
        background: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite"
      }}
    />
  );
}