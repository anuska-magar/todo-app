// Button.jsx
// A small reusable button used anywhere in the app (add, delete, save, cancel)

function Button({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
                 hover:bg-indigo-700 transition-colors duration-200
                 active:scale-95"
    >
      {label}
    </button>
  );
}

export default Button;