import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  to,
  disabled,
  fullWidth,
  type = 'button',
  isLoading = false,
  loadingText = 'Loading...',
  startIcon,
  endIcon,
  onClick,
  ...rest
}, ref) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium shadow-soft transition-all duration-200 focus:outline-none';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-soft-md focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 hover:shadow-soft-md focus:ring-2 focus:ring-secondary-500/50 focus:ring-offset-2',
    outline: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-2',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-accent-600 text-white hover:bg-accent-700 hover:shadow-soft-md focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-2',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-soft-md focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2',
  };
  
  // Disabled state
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  // Full width
  const fullWidthClasses = 'w-full';
  
  // Combine all the classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || isLoading ? disabledClasses : ''}
    ${fullWidth ? fullWidthClasses : ''}
    ${className}
  `;
  
  // If the button is a link (has "to" prop)
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        ref={ref}
        {...rest}
      >
        {startIcon && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </Link>
    );
  }
  
  // Regular button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      ref={ref}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        <>
          {startIcon && <span className="mr-2 flex-shrink-0">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-2 flex-shrink-0">{endIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 