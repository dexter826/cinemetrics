import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  maxHeight?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  className = '',
  disabled = false,
  searchable = false,
  maxHeight = '200px',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery('');
      }
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-left
          focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
          hover:border-primary/30 transition-all duration-200
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-primary/50 ring-1 ring-primary/20' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`text-sm ${selectedOption ? 'text-text-main' : 'text-text-muted'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 right-0 mt-1 bg-surface border border-black/10 dark:border-white/10
            rounded-xl shadow-lg z-50
          "
          role="listbox"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-black/5 dark:border-white/5">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="
                  w-full bg-black/5 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-sm
                  focus:outline-none focus:ring-1 focus:ring-primary/50 text-text-main placeholder-text-muted
                "
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-text-muted text-center">
                {searchable && searchQuery ? 'Không tìm thấy kết quả' : 'Không có tùy chọn'}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-3 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5
                    transition-colors duration-150 flex items-center justify-between
                    ${option.value === value ? 'bg-primary/10 text-primary' : 'text-text-main'}
                  `}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check size={16} className="text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;