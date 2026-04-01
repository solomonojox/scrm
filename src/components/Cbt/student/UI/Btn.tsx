// ─── Btn ──────────────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  onClick?: () => void;
  disabled?: boolean;
  cls?: string;
  type?: "button" | "submit" | "reset";
}

export const Btn: React.FC<BtnProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  cls = "",
  type = "button",
}) => {
  const base =
    "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<BtnVariant, string> = {
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400 shadow-sm hover:shadow-md",
    secondary: "bg-orange-50 hover:bg-orange-100 text-orange-600 focus:ring-orange-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    outline: "border-2 border-orange-500 text-orange-600 hover:bg-orange-50 focus:ring-orange-300",
  };
  const sizes: Record<BtnSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${cls}`}
    >
      {children}
    </button>
  );
};
