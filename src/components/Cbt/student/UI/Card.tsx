
// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  cls?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, cls = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm border border-gray-100
      ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
      ${cls}`}
  >
    {children}
  </div>
);