// Input.jsx
// A reusable text input used for typing a new todo or subtodo

function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700
                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                 focus:border-transparent"
    />
  );
}

export default Input;