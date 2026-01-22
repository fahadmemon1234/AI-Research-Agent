import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary'
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const disabledClass = disabled ? 'disabled' : '';
  const customClasses = className;

  const buttonClasses = `${baseClasses} ${variantClass} ${disabledClass} ${customClasses}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;