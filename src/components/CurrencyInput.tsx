
import React, { useState, useEffect } from 'react';
import { CircleDollarSign, X } from 'lucide-react';

interface CurrencyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isPercentage?: boolean;
  onClear?: () => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  isPercentage = false,
  onClear
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value;
    
    // Remove non-numeric characters except decimal points
    inputVal = inputVal.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = inputVal.split('.');
    if (parts.length > 2) {
      inputVal = parts[0] + '.' + parts.slice(1).join('');
    }
    
    onChange(inputVal);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className={`input-container ${isFocused ? 'scale-[1.01] transition-transform' : ''}`}>
        <CircleDollarSign 
          className="currency-icon" 
          size={18} 
        />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || '0'}
          className={isPercentage ? 'percentage-input' : 'currency-input'}
        />
        {value && onClear && (
          <button 
            onClick={onClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        {isPercentage && (
          <span className="absolute right-3 text-gray-500">%</span>
        )}
      </div>
    </div>
  );
};

export default CurrencyInput;
