import React from 'react';

interface ButtonProps {
  className?: string;
  type: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, type, children }) => {
  return <button className={className} type={type}>{children}</button>;
};

export default Button;