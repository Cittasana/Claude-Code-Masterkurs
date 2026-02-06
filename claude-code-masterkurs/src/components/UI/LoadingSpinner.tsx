interface Props {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const LoadingSpinner = ({ size = 'md', label }: Props) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12" role="status">
      <div
        className={`${sizeClasses[size]} rounded-full border-apple-border border-t-apple-accent animate-spin`}
      />
      {label && (
        <p className="text-apple-textSecondary text-sm mt-4 font-mono">{label}</p>
      )}
      <span className="sr-only">Wird geladen...</span>
    </div>
  );
};

export default LoadingSpinner;
