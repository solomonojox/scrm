// components/ui/Skeleton.tsx
//
// Placeholder only. If the Educat Admin Dashboard already has a
// skeleton-loader component, delete this file and import that one
// instead in AdminTeacherAttendance / Table / History — the call
// signature (`<Skeleton className="..." />`) should be compatible
// with most existing implementations.
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}