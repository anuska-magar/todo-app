import Header from "./Header";

function Layout({ children, totalCount, completedCount }) {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#fdf6f0" }}>
      <Header totalCount={totalCount} completedCount={completedCount} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;