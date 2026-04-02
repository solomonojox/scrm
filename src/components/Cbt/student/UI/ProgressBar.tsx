
// ─── ProgressBar ──────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "bg-orange-500",
  height = "h-2",
}) => (
  <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
    <div
      className={`${color} ${height} rounded-full transition-all duration-700`}
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);
