import React from 'react';

const ProductTable = ({ products, onRowClick, getRowClass }) => {
  return (
    <div className="w-full max-w-6xl overflow-x-auto bg-base-200 border border-base-300 rounded-lg shadow-md">
      <table className="min-w-full bg-base-100">
        <thead className="bg-base-300 border-b">
          <tr>
            <th className="p-4 text-left text-base-content">Name</th>
            <th className="p-4 text-left text-base-content">Origin Country</th>
            <th className="p-4 text-left text-base-content">Category</th>
            <th className="p-4 text-left text-base-content">Barcode</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.url}
                className={`${getRowClass(product)} cursor-pointer`}
                onClick={() => onRowClick(product)}
              >
                <td className="p-4 text-base-content">{product.name}</td>
                <td className="p-4 text-base-content flex items-center">
                  {product.origin_country}
                  {product.origin_country === 'BD' && (
                    <img
                      src="https://flagsapi.com/BD/shiny/32.png"
                      alt="Bangladesh Flag"
                      className="inline-block ml-2 w-6 h-6"
                    />
                  )}
                  {product.origin_country === 'IN' && (
                    <img
                      src="https://flagsapi.com/IN/shiny/32.png"
                      alt="India Flag"
                      className="inline-block ml-2 w-6 h-6"
                    />
                  )}
                </td>
                <td className="p-4 text-base-content">{product.category}</td>
                <td className="p-4 text-base-content">{product.barcode || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-base-content">No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
