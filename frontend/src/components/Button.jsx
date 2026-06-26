function Button({ label, onClick, variant = "primary", icon, fullWidth = false, disabled = false }) {
  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap " +
    "transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "text-white" ,
    danger: "bg-transparent text-red-400 hover:text-red-600",
    ghost: "bg-transparent text-gray-400 hover:text-gray-600",
  };

  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{ backgroundColor: "#6b3f5e" }}
        className={`${baseClasses} text-white hover:opacity-90 ${fullWidth ? "w-full" : ""}`}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Button;