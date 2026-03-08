interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon && <div className="text-gray-300 mb-2">{icon}</div>}
      <p className="text-sm text-gray-500">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
