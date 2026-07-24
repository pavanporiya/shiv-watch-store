export default function EmptyState({
  icon = "⌚",
  title = "No items found",
  description = "There are no items to display right now.",
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  style = {},
}) {
  return (
    <div
      className="empty-state-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        margin: "24px 0",
        background: "var(--bg-card, #141417)",
        borderRadius: "var(--radius-lg, 16px)",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
        ...style,
      }}
    >
      <div
        className="empty-icon"
        style={{
          fontSize: "44px",
          marginBottom: "16px",
          lineHeight: 1,
          opacity: 0.9,
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "var(--text-primary, #ffffff)",
          marginBottom: "8px",
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary, #a1a1aa)",
          maxWidth: "420px",
          lineHeight: "1.5",
          marginBottom: actionText || secondaryActionText ? "24px" : "0",
        }}
      >
        {description}
      </p>

      {(actionText || secondaryActionText) && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {actionText && (
            <button
              onClick={onAction}
              className="shop-btn"
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "var(--radius-full, 9999px)",
                cursor: "pointer",
              }}
            >
              {actionText}
            </button>
          )}

          {secondaryActionText && (
            <button
              onClick={onSecondaryAction}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
                background: "transparent",
                color: "var(--text-secondary, #a1a1aa)",
                border: "1px solid var(--border, rgba(255,255,255,0.15))",
                borderRadius: "var(--radius-full, 9999px)",
                cursor: "pointer",
                transition: "var(--transition, all 0.2s)",
              }}
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
