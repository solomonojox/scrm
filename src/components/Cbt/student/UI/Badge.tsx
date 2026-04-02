
// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = "orange" | "green" | "red" | "blue" | "gray" | "yellow";

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  cls?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = "orange", cls = "" }) => {
  const variants: Record<BadgeVariant, string> = {
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-600",
    yellow: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${variants[variant]} ${cls}`}>
      {text}
    </span>
  );
};
