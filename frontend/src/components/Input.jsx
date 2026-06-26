function Input({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl border-0 bg-transparent text-sm text-gray-600
                 placeholder-gray-400
                 focus:outline-none focus:ring-0
                 transition-all duration-200 ${className}`}
    />
  );
}

export default Input;