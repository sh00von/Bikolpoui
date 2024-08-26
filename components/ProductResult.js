import React, { useState, useEffect } from 'react';
import RelatedProducts from './RelatedProducts';

const ProductResult = ({ productDetails, products, loading }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRelatedProducts = () => {
      if (productDetails && products) {
        try {
          console.log('Product Details:', productDetails); // Debugging log
          console.log('All Products:', products); // Debugging log

          // Extract related products from the productDetails
          const extractedRelatedProducts = productDetails.related_product || [];
          console.log('Extracted Related Products:', extractedRelatedProducts); // Debugging log

          // Find additional related products in the same category
          const additionalRelatedProducts = products.filter(
            p => p.category === productDetails.category && p.id !== productDetails.id
          );
          console.log('Additional Related Products:', additionalRelatedProducts); // Debugging log

          // Combine extracted related products with additional related products
          const allRelatedProducts = [
            ...extractedRelatedProducts,
            ...additionalRelatedProducts
          ].filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id
            ))
          );

          console.log('All Combined Related Products:', allRelatedProducts); // Debugging log

          setRelatedProducts(allRelatedProducts);
        } catch (err) {
          console.error('Failed to process related products', err);
          setError('Failed to process related products');
          setRelatedProducts([]);
        }
      } else {
        console.warn('Product Details or Products not provided'); // Debugging log
      }
    };

    fetchRelatedProducts();
  }, [productDetails, products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-base-content text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 border border-base-300 rounded-lg bg-base-100">
      {productDetails ? (
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
              {productDetails.origin_country === 'Bangladesh' && (
                <img
                  src="https://flagsapi.com/BD/flat/64.png"
                  alt="Bangladesh Flag"
                  className="w-6 h-6"
                />
              )}
              {productDetails.origin_country === 'India' && (
                <img
                  src="https://flagsapi.com/IN/flat/64.png"
                  alt="India Flag"
                  className="w-6 h-6"
                />
              )}
            </div>
            <p className="text-base-content"><strong>Barcode:</strong> {productDetails.barcode || 'N/A'}</p>
            <p className="text-base-content"><strong>Details:</strong> {productDetails.details || 'No additional details'}</p>
            <div className="text-center mt-4">
              {productDetails.origin_country === 'India' ? (
                <span className="text-red-600 text-3xl">✘</span>
              ) : (
                <span className="text-green-600 text-3xl">✔</span>
              )}
            </div>
          </div>
          {relatedProducts.length > 0 ? (
            <RelatedProducts relatedProducts={relatedProducts} />
          ) : (
            <p className="text-center text-base-content">No related products found.</p>
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
