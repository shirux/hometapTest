import React from "react";

type SearchBarProps = {
  handleClick?: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  disabled?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 w-full max-w-3xl mx-auto px-4 sm:px-0">
      <input
        type="text"
        value={props.searchTerm}
        onChange={(e) => props.setSearchTerm(e.target.value)}
        placeholder="Enter full address, including street, city, state, and zip"
        className="flex-1 p-3 border border-gray-300 rounded-md w-full sm:w-auto min-w-0"
      />
      <button
        onClick={props.handleClick}
        disabled={props.disabled || false}
        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
