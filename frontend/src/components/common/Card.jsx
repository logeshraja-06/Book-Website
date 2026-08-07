export default function Card({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) {
  const base =
    'bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] shadow-sm transition-all duration-300';
  const hover = hoverable ? 'hover:border-[#D3968C]' : '';
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
