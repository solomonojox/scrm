import { Card } from "./Card";
import Icon from "./Icon";

// ─── StatCard ─────────────────────────────────────────────────────────────────
type StatCardColor = "orange" | "blue" | "green" | "purple";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color?: StatCardColor;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  icon,
  color = "orange",
}) => {
  const colors: Record<StatCardColor, string> = {
    orange: "bg-orange-50 text-orange-500",
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    purple: "bg-purple-50 text-purple-500",
  };
  return (
    <Card cls="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon name={icon} size={22} />
        </div>
      </div>
    </Card>
  );
};
