// Badge.jsx
// Shows a small count label e.g. "2 subtasks" or "Done"

function Badge({ text }) {
  const isDone = text.toLowerCase() === "done";

  const colorClasses = isDone
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colorClasses}`}
    >
      {text}
    </span>
  );
}

export default Badge;
