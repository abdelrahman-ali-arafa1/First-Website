function Card({ children, className = '', hoverEffect = false, ...rest }) {
  const baseClasses = 'bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden';
  const hoverClasses = hoverEffect ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-md' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...rest }) {
  return (
    <div 
      className={`p-5 border-b border-gray-100 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...rest }) {
  return (
    <div 
      className={`p-5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...rest }) {
  return (
    <div 
      className={`p-5 bg-gray-50 border-t border-gray-100 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardMedia({ src, alt = '', className = '', aspectRatio = 'aspect-video', ...rest }) {
  return (
    <div className={`${aspectRatio} w-full overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        {...rest}
      />
    </div>
  );
}

export default Card; 