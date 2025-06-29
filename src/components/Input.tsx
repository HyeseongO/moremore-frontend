interface InputProps {
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  className: string;
}

function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  className = '',
}: InputProps) {
  return (
    <input
      className={className}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      name={name}
    />
  );
}

export default Input;
