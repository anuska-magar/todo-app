// Badge.jsx
// Shows a small count label e.g. "2 subtasks" or "Done"

function Badge({ text }) {
  // Pick a color based on what the badge says.
  // "Done" gets green, everything else gets a neutral gray pill.
  const isDone = text.toLowerCase() === "done";

  const colorClasses = isDone
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses}`}
    >
      {text}
    </span>
  );
}

export default Badge;