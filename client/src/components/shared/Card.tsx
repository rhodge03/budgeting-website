interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'blue' | 'purple' | 'green' | 'amber';
  padding?: boolean;
}

const ACCENT_CLASSES: Record<string, string> = {
  blue: 'border-l-4 border-l-blue-500',
  purple: 'border-l-4 border-l-purple-500',
  green: 'border-l-4 border-l-green-500',
  amber: 'border-l-4 border-l-amber-500',
};

export default function Card({
  children,
  className = '',
  accent,
  padding = true,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm ${padding ? 'p-4' : ''} ${accent ? ACCENT_CLASSES[accent] : ''} ${className}`}
    >
      {children}
    </div>
  );
}
