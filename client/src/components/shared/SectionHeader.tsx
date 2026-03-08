interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ children, className = '' }: SectionHeaderProps) {
  return (
    <h3 className={`text-sm font-semibold text-gray-900 border-l-2 border-blue-500 pl-2 ${className}`}>
      {children}
    </h3>
  );
}
