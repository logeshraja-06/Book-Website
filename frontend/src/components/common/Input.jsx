import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    rows = 4,
    options = [],
    error,
    hint,
    className = '',
    ...props
  },
  ref
) {
  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs uppercase font-mono tracking-widest text-[#6E6A67] block">
          {label} {required && <span className="text-[#D3968C]">*</span>}
        </label>
      )}

      {isTextarea ? (
        <textarea
          ref={ref}
          rows={rows}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-b-2 border-[#E7D9D3] focus:border-[#D3968C] py-2.5 text-base text-[#2B2B2B] placeholder-[#6E6A67]/40 focus:outline-none transition-colors duration-300 resize-none leading-relaxed"
          {...props}
        />
      ) : isSelect ? (
        <select
          ref={ref}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-b-2 border-[#E7D9D3] focus:border-[#D3968C] py-2.5 text-base text-[#2B2B2B] focus:outline-none transition-colors duration-300 cursor-pointer"
          {...props}
        >
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={ref}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-b-2 border-[#E7D9D3] focus:border-[#D3968C] py-2.5 text-base text-[#2B2B2B] placeholder-[#6E6A67]/40 focus:outline-none transition-colors duration-300 font-sans"
          {...props}
        />
      )}

      {hint && <p className="text-[11px] font-mono text-[#6E6A67] italic">{hint}</p>}
      {error && <p className="text-[11px] font-mono text-[#C98579] font-medium">{error}</p>}
    </div>
  );
});

export default Input;
