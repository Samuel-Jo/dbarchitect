import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-sm";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-md",
    secondary: "bg-slate-200 text-slate-700 hover:bg-slate-300",
    outline: "border-2 border-brand-600 text-brand-600 hover:bg-brand-50",
    success: "bg-emerald-500 text-white hover:bg-emerald-600"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};