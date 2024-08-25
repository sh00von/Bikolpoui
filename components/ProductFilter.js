import React from 'react';

const ProductFilter = ({ filter, onFilterChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="filter" className="mr-2 text-base-content">Filter by Origin:</label>
      <select
        id="filter"
        value={filter}
        onChange={onFilterChange}
        className="p-2 border border-base-300 rounded-md"
      >
        <option value="all">All</option>
        <option value="BD">Bangladesh</option>
        <option value="IN">India</option>
      </select>
    </div>
  );
};

export default ProductFilter;
