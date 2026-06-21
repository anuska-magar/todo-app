import { useState } from "react";
import Layout from "../components/Layout";
import TodoList from "../components/TodoList";

function HomePage() {
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  function handleCountChange(total, completed) {
    setTotalCount(total);
    setCompletedCount(completed);
  }

  return (
    <Layout totalCount={totalCount} completedCount={completedCount}>
      {/* Profile Section REMOVED - Now only accessible via header button */}
      <TodoList onCountChange={handleCountChange} />
    </Layout>
  );
}

export default HomePage;