import { forwardRef } from 'react';

const SelectOption = forwardRef(({
  label,
  name,
  options,
  defaultValue,
  required,
  onChange,
  className = ''
}, ref) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      id={name}
      name={name}
      defaultValue={defaultValue}
      required={required}
      onChange={onChange}
      ref={ref} // Forward the ref to the select element
      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm ${className}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

// Set the displayName property
SelectOption.displayName = 'SelectOption';

export { SelectOption };