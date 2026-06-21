// Input.jsx
// A reusable text input used for typing a new todo or subtodo
// type defaults to "text" so existing usages (todo, subtask) keep working unchanged

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-black-200 text-sm text-gray-700
                 placeholder-gray-400 bg-white
                 focus:outline-none focus:ring-2 focus:black-400 focus:border-transparent
                 transition-all duration-300"
    />
  );
}

export default Input;