// Button.jsx
// A small reusable button used anywhere in the app (add, delete, save, cancel)
// variant controls the color theme: "primary" (default), "danger", or "ghost"

function Button({ label, onClick, variant = "primary", icon }) {
  const baseClasses =
    "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium " +
    "transition-all duration-300 hover:scale-105 active:scale-95";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm hover:shadow-md",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100",
    ghost:
      "bg-gray-100 text-gray-600 hover:bg-gray-200",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Button;