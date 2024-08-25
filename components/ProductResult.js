import React, { useState, useEffect } from 'react';
import RelatedProducts from './RelatedProducts';

const ProductResult = ({ productDetails, loading }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (productDetails && productDetails.category) {
        try {
          const response = await fetch(`/api/products?category=${productDetails.category}`);
          const data = await response.json();

          // Filter out the product itself from the related products list
          const filteredProducts = data.filter(product => product.url !== productDetails.url);
          setRelatedProducts(filteredProducts);
        } catch (err) {
          console.error('Failed to fetch related products by category', err);
          setError('Failed to fetch related products');
          setRelatedProducts([]);
        }
      }
    };

    fetchRelatedProducts();
  }, [productDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-base-content text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 border border-base-300 rounded-lg bg-base-100">
      {productDetails.name ? (
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
          {relatedProducts.length > 0 && (
            <RelatedProducts relatedProducts={relatedProducts} />
          )}
          {error && <p className="text-error">{error}</p>}
        </>
      ) : (
        <p className="text-center text-error">No product details available.</p>
      )}
    </div>
  );
};

export default ProductResult;
