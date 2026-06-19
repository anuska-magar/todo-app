// Button.jsx
// A small reusable button used anywhere in the app (add, delete, save, cancel)

function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

export default Button;