export default function Card({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) {
  const base =
    'bg-[#FFFDF3] rounded-2xl p-6 border border-[#E9E5C8] shadow-2xs transition-all duration-300';
  const hover = hoverable ? 'hover:border-[#7B021D]' : '';
  const clickable = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`${base} ${hover} ${clickable} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
