interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'blue' | 'purple' | 'green' | 'amber';
  padding?: boolean;
  elevation?: 'sm' | 'md' | 'lg';
}

const ACCENT_CLASSES: Record<string, string> = {
  blue: 'border-l-4 border-l-blue-500',
  purple: 'border-l-4 border-l-purple-500',
  green: 'border-l-4 border-l-green-500',
  amber: 'border-l-4 border-l-amber-500',
};

const ELEVATION_CLASSES: Record<string, string> = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export default function Card({
  children,
  className = '',
  accent,
  padding = true,
  elevation = 'sm',
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl ${ELEVATION_CLASSES[elevation]} ${padding ? 'p-4' : ''} ${accent ? ACCENT_CLASSES[accent] : ''} ${className}`}
    >
      {children}
    </div>
  );
}
