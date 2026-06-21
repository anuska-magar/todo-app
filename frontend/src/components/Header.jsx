import { ClipboardList } from "lucide-react";

function Header({ totalCount = 0, completedCount = 0 }) {
  const remaining = totalCount - completedCount;

  return (
    <header className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 px- py-6 mb-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-black p-3 rounded-xl shadow-sm">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Todo App</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Stay organized, one task at a time.
            </p>
          </div>
        </div>

        {/* Live task summary */}
        {totalCount > 0 && (
          <div className="bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">
            {completedCount} done · {remaining} remaining
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;