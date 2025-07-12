import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  name,
  placeholder,
  defaultValue,
  required,
  onInput,
  maxLength,
  className = ''
}, ref) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required={required}
      onInput={onInput}
      maxLength={maxLength}
      ref={ref}
      className={`mt-1 block p-2 border border-gray-300 rounded-md shadow-sm ${className}`}
    />
  </div>
));

Textarea.displayName = 'Textarea';

export { Textarea };