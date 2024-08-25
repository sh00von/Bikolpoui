import { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js'; // Import fuse.js
import debounce from 'debounce';
import Layout from '../components/Layout';
import SearchInput from '../components/SearchInput';
import ProductResult from '../components/ProductResult';
import Spinner from '../components/Spinner';
import Link from 'next/link'; // Ensure correct import for Link

export default function Home() {
  const [searchValue, setSearchValue] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.results || []);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Function to get suggestions using fuzzy search
  const getSuggestions = (input) => {
    if (!Array.isArray(products) || input.trim() === '') return [];
    
    const fuse = new Fuse(products, {
      keys: ['name', 'barcode'], // Adjust these keys based on your data structure
      includeScore: true,
      threshold: 0.3, // Adjust the threshold for fuzzy matching
    });
    
    const result = fuse.search(input);
    return result.map(({ item }) => item);
  };

  const debouncedGetSuggestions = useCallback(debounce((input) => {
    setSuggestions(getSuggestions(input));
  }, 300), [products]);

  const checkProduct = async (productName) => {
    setLoading(true);
    const product = products.find(p => p.name === productName);
    if (!product) {
      setProductDetails(null);
      setRelatedProducts([]);
      setLoading(false);
      return;
    }

    setProductDetails(product);

    const related = product.related_product || [];
    const filteredRelated = related.filter(r =>
      r.barcode || r.details || r.approved
    );
    setRelatedProducts(filteredRelated);
    setLoading(false);
  };

  const handleInputChange = (value) => {
    setSearchValue(value);
    setSearchPerformed(true); // Set to true when input changes
    debouncedGetSuggestions(value);
  };

  const handleSuggestionClick = (productName) => {
    setSearchValue(productName);
    setSuggestions([]);
    checkProduct(productName);
  };

  return (
<Layout title="Home | BikOlpoo" description="Identify products from India and find Bangladeshi alternatives.">
  <div className="flex flex-col items-center justify-center min-h-screen p-6">
    <div className="w-full max-w-4xl bg-base-300 shadow-lg rounded-lg p-6">
      <h1 className="text-4xl font-bold mb-4 text-primary text-center">BikOlpoo</h1>
      <p className="text-lg text-base-content mb-8 text-center">
        This application is designed to help you identify products from India and suggest Bangladeshi alternatives. Made by Random Citizens, our goal is to provide you with reliable information about product origins to make informed decisions. Enter a product name or barcode to see if it is of Indian origin. If it is, we will show you safer alternatives from Bangladesh.
      </p>
      <SearchInput
        value={searchValue}
        onChange={handleInputChange}
        onSuggestionClick={handleSuggestionClick}
        suggestions={suggestions}
      />
      {searchPerformed && (
        <div className={`transition-opacity duration-500 ease-in-out ${searchPerformed ? 'opacity-100' : 'opacity-0'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Spinner />
            </div>
          ) : productDetails ? (
            <ProductResult
              productDetails={productDetails}
              relatedProducts={relatedProducts}
              loading={loading}
            />
          ) : (
            <p className="text-center text-error"></p>
          )}
        </div>
      )}
      <div className="mt-8 text-center">
        <Link href="/products" className="text-blue-500 hover:underline">
          View all products
        </Link>
      </div>
    </div>
  </div>
</Layout>

  );
}
