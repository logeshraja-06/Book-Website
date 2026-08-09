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
        <label className="text-xs uppercase font-mono tracking-widest text-[#6B5E5E] font-bold block">
          {label} {required && <span className="text-[#212842]">*</span>}
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
          className="w-full bg-transparent border-b-2 border-[#E9E5C8] focus:border-[#212842] py-2.5 text-base text-[#211D1D] placeholder-[#6B5E5E]/40 focus:outline-none transition-colors duration-300 resize-none leading-relaxed"
          {...props}
        />
      ) : isSelect ? (
        <select
          ref={ref}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-b-2 border-[#E9E5C8] focus:border-[#212842] py-2.5 text-base text-[#211D1D] focus:outline-none transition-colors duration-300 cursor-pointer"
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
          className="w-full bg-transparent border-b-2 border-[#E9E5C8] focus:border-[#212842] py-2.5 text-base text-[#211D1D] placeholder-[#6B5E5E]/40 focus:outline-none transition-colors duration-300 font-sans"
          {...props}
        />
      )}

      {hint && <p className="text-[11px] font-mono text-[#6B5E5E] italic">{hint}</p>}
      {error && <p className="text-[11px] font-mono text-[#212842] font-medium">{error}</p>}
    </div>
  );
});

export default Input;
