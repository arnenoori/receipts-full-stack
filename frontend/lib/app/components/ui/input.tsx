import React from 'react';

interface InputProps {
  type: string;
  id?: string;
  name?: string;
  className?: string;
  multiple?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({ type, id, name, className, multiple, onChange }) => {
  return <input type={type} id={id} name={name} className={className} multiple={multiple} onChange={onChange} />;
};

export default Input;