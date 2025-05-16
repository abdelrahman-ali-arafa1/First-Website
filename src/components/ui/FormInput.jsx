import { forwardRef } from 'react';

const FormInput = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  error,
  helperText,
  className = '',
  containerClassName = '',
  labelClassName = '',
  icon,
  required = false,
  ...rest
}, ref) => {
  const inputId = id || name;
  
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 mb-1.5 ${labelClassName}`}
        >
          {label} {required && <span className="text-accent-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
                <input          ref={ref}          type={type}          id={inputId}          name={name}          placeholder={placeholder}          className={`            w-full border rounded-lg            px-4 py-2.5 h-11            ${icon ? 'pl-10' : ''}            ${error               ? 'border-accent-300 bg-accent-50 focus:ring-accent-500 focus:border-accent-500'               : 'border-gray-200 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300'}            focus:outline-none focus:ring-2 focus:ring-opacity-30            disabled:bg-gray-100 disabled:cursor-not-allowed            transition-colors duration-200            text-base            ${className}          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText || error ? `${inputId}-description` : undefined}
          required={required}
          {...rest}
        />
      </div>
      
      {(error || helperText) && (
        <div 
          id={`${inputId}-description`} 
          className={`mt-1.5 text-sm ${error ? 'text-accent-600' : 'text-gray-500'}`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput; 