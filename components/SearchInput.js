import React from 'react';

const SearchInput = ({ value, onChange, onSuggestionClick, suggestions }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-base-300 rounded-lg"
        placeholder="Search for a product..."
      />
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => onSuggestionClick(suggestion.name)}
              className="p-3 cursor-pointer hover:bg-base-200"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
