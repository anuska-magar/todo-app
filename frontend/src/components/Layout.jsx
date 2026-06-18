// Wraps the whole page. Header at top, main content below

import Header from "./Header";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default Layout;