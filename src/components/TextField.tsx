import React from 'react';
import './styles/textfieldStyles.css';

interface TextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: string;
  required?: boolean;
  onFocus: () => void;
  error: string;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  value,
  onChange,
  onFocus,
  label,
  type = 'text',
  required = false,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onFocus();
  };

  const hasError = error !== '';

  return (
    <>
      <div className='input-container'>
        {type === 'long-text' ? (
          <textarea className={`text-field ${hasError ? 'error' : ''}`} id={id} value={value} onChange={handleChange} />
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            onChange={handleChange}
            className={`text-field ${hasError ? 'error' : ''}`}
            placeholder={' '}
            required={required}
            onFocus={handleFocus}
          />
        )}

        <label htmlFor={id} className={`placeholder-label ${hasError ? 'error' : ''}`}>
          {label}
        </label>
        {hasError && <div className='error-message'>{error}</div>}
      </div>
    </>
  );
};

export default TextField;
