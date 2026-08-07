import { Link } from 'react-router-dom';

export default function Button({
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'text'
  size = 'md', // 'sm' | 'md' | 'lg'
  to,
  type = 'button',
  onClick,
  disabled = false,
  children,
  icon: Icon,
  iconPosition = 'right',
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-300 min-h-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-4 py-2 text-[11px] rounded-full gap-1.5',
    md: 'px-6 py-3 text-xs rounded-full gap-2',
    lg: 'px-8 py-4 text-xs rounded-full gap-2.5 shadow-md',
  };

  const variantStyles = {
    primary:
      'bg-[#2B2B2B] text-[#FAF8F6] hover:bg-[#D3968C] hover:text-[#FAF8F6] shadow-sm',
    secondary:
      'bg-[#F4EEEA] border border-[#E7D9D3] text-[#2B2B2B] hover:border-[#D3968C] hover:text-[#D3968C]',
    ghost:
      'border border-[#E7D9D3] text-[#2B2B2B] hover:border-[#2B2B2B] hover:text-[#2B2B2B]',
    text:
      'text-[#2B2B2B] hover:text-[#D3968C] py-1 px-0 min-h-0 normal-case tracking-normal font-medium hover:underline',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
    variantStyles[variant] || variantStyles.primary
  } ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
}
