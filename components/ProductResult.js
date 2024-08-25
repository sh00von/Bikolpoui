import React from 'react';
import RelatedProducts from './RelatedProducts';

const ProductResult = ({ productDetails, relatedProducts, loading }) => {
  if (loading) {
    return <p className="text-base-content">Loading...</p>;
  }

  return (
    <div className="mt-6 p-4 border border-base-300 rounded-lg bg-base-100">
      {productDetails.name && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Product Details:</h3>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-base-content"><strong>Name:</strong> {productDetails.name}</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-base-content">
                <strong>Origin Country:</strong> {productDetails.origin_country}
              </p>
              {productDetails.origin_country === 'BD' && (
                <img
                  src="https://flagsapi.com/BD/flat/64.png"
                  alt="Bangladesh Flag"
                  className="w-6 h-6"
                />
              )}
            </div>
            <p className="text-base-content"><strong>Barcode:</strong> {productDetails.barcode || 'N/A'}</p>
            <p className="text-base-content"><strong>Details:</strong> {productDetails.details || 'No additional details'}</p>
            <div className="text-center mt-4">
              {productDetails.origin_country === 'IN' ? (
                <span className="text-red-600 text-3xl">✘</span>
              ) : (
                <span className="text-green-600 text-3xl">✔</span>
              )}
            </div>
          </div>
          <RelatedProducts relatedProducts={relatedProducts} />
        </>
      )}
    </div>
  );
};

export default ProductResult;
