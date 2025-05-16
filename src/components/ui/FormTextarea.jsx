import { forwardRef } from 'react';

const FormTextarea = forwardRef(({
  label,
  id,
  name,
  placeholder,
  error,
  helperText,
  className = '',
  containerClassName = '',
  labelClassName = '',
  required = false,
  rows = 4,
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
      
      <textarea
        ref={ref}
        id={inputId}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-4 py-2.5 border rounded-lg 
          ${error 
            ? 'border-accent-300 bg-accent-50 focus:ring-accent-500 focus:border-accent-500' 
            : 'border-gray-200 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-opacity-30
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors duration-200
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={helperText || error ? `${inputId}-description` : undefined}
        required={required}
        {...rest}
      ></textarea>
      
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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea; 