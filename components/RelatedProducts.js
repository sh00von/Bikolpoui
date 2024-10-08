import React from 'react';

const RelatedProducts = ({ relatedProducts }) => {
  return (
    relatedProducts.length > 0 && (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Related Products:</h3>
        <ul className="space-y-4">
          {relatedProducts.map((related, index) => (
            <li
              key={index}
              className={`p-4 border rounded-lg ${
                related.origin_country === 'India'
                  ? 'bg-red-800 border-red-300'
                  : 'bg-green-800 border-green-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-6 h-6 rounded-full ${
                    related.origin_country === 'India'
                      ? 'bg-red-600'
                      : 'bg-green-600'
                  } flex items-center justify-center`}
                >
                  <span className="text-white text-xs">
                    {related.origin_country === 'India' ? 'IN' : 'BD'}
                  </span>
                </span>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-base-content flex items-center gap-2">
                    {related.name}
                    {related.origin_country === 'Bangladesh' && (
                      <img
                        src="https://flagsapi.com/BD/flat/64.png"
                        alt="Bangladesh Flag"
                        className="w-5 h-5"
                      />
                    )}
                  </h4>
                  <p className="text-base-content mt-1">
                    <strong>Details:</strong> {related.details || 'No details available'}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default RelatedProducts;
