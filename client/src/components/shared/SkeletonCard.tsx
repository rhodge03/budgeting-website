export default function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <div className="skeleton h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3" style={{ width: `${85 - i * 10}%` }} />
      ))}
    </div>
  );
}
