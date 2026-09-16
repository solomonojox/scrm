
interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'sm' | 'lg';
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ name, src, size = 'sm' }: AvatarProps) {
  const dimension = size === 'lg' ? 'h-12 w-12 text-base' : 'h-8 w-8 text-xs';
  if (src) {
    return <img src={src} alt={name} className={`${dimension} rounded-full object-cover`} />;
  }
  return (
    <div
      className={`flex ${dimension} items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700`}
    >
      {initials(name)}
    </div>
  );
}