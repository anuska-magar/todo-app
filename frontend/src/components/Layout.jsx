import Header from "./Header";

function Layout({ children, totalCount, completedCount }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "Inter, sans-serif" }}>

      <Header totalCount={totalCount} completedCount={completedCount} />

      <main
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "32px 16px",
        }}
      >
        {children}
      </main>

    </div>
  );
}

export default Layout;