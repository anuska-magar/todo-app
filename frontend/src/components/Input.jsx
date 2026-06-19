// Input.jsx
// A reusable text input used for typing a new todo or subtodo

function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default Input;