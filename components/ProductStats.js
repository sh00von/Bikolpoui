import React from 'react';

const ProductStats = ({ totalProducts, bdCount, inCount }) => {
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-300 p-4 rounded-lg">
      <div className="stat place-items-center bg-base-300 p-4">
        <div className="stat-title">Total Products</div>
        <div className="stat-value text-3xl font-bold">{totalProducts}</div>
        <div className="stat-desc text-sm text-base-content">Overall count of products listed.</div>
      </div>

      <div className="stat place-items-center bg-base-300 p-4">
        <div className="stat-title">Bangladesh Products</div>
        <div className="stat-value text-3xl font-bold text-green-600">{bdCount}</div>
        <div className="stat-desc text-sm text-base-content">Products originating from Bangladesh.</div>
      </div>

      <div className="stat place-items-center bg-base-300 p-4">
        <div className="stat-title">Indian Products</div>
        <div className="stat-value text-3xl font-bold text-red-600">{inCount}</div>
        <div className="stat-desc text-sm text-base-content">Products originating from India.</div>
      </div>
    </div>
  );
};

export default ProductStats;
