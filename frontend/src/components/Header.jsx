function Header({ totalCount = 0, completedCount = 0 }) {
  const remaining = totalCount - completedCount;

  return (
    <header
      style={{
        backgroundColor: "#4f46e5",
        color: "#fff",
        padding: "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700" }}>📝 Todo App</h1>
        <p style={{ margin: "4px 0 0", fontSize: "0.875rem", opacity: 0.85 }}>
          Stay organized, one task at a time.
        </p>
      </div>

      {/* Live task summary */}
      {totalCount > 0 && (
        <div style={{ fontSize: "0.875rem", opacity: 0.9, textAlign: "right" }}>
          <span>{completedCount} done</span>
          <span style={{ margin: "0 8px" }}>·</span>
          <span>{remaining} remaining</span>
        </div>
      )}
    </header>
  );
}

export default Header;