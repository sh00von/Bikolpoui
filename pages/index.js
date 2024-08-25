import { useState, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js'; // Import fuse.js
import debounce from 'debounce';
import Layout from '../components/Layout';
import SearchInput from '../components/SearchInput';
import ProductResult from '../components/ProductResult';
import Spinner from '../components/Spinner';
import Link from 'next/link'; // Ensure correct import for Link

const LOCAL_STORAGE_KEY = 'productData';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export default function Home() {
  const [searchValue, setSearchValue] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Fetch products from API or localStorage
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Check if data is available in localStorage and is still valid
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const cachedTime = localStorage.getItem(`${LOCAL_STORAGE_KEY}_timestamp`);
        
        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_EXPIRY_TIME)) {
          console.log('Using cached data');
          setProducts(JSON.parse(cachedData));
        } else {
          console.log('Fetching data from API');
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log('API Data:', data);
          
          // Save data to localStorage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_timestamp`, Date.now().toString());
          setProducts(data || []);
        }
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
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
      keys: ['name', 'barcode', 'details', 'category'], // Include details and category in search
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

    // Find related products from related_product field
    const related = product.related_product || [];
    console.log('Related Products:', related); // Log related products

    // Fetch related product details
    const relatedProductsDetails = await Promise.all(
      related.map(async (relatedProduct) => {
        // Only include approved related products
        if (relatedProduct.approved) {
          try {
            return relatedProduct; // Use the related product details from the API response
          } catch (err) {
            console.error('Failed to fetch related product details:', err);
            return null;
          }
        }
        return null;
      })
    );

    // Filter out null values and products not meeting criteria
    const filteredRelated = relatedProductsDetails
      .filter(r => r && (r.barcode || r.details || r.approved));

    // Find additional related products in the same category
    const sameCategoryRelated = findRelatedProductsByCategory(product.category);

    // Combine related products from both sources
    const allRelatedProducts = [...filteredRelated, ...sameCategoryRelated];

    setRelatedProducts(allRelatedProducts);
    setLoading(false);
  };

  const findRelatedProductsByCategory = (category) => {
    return products.filter(p => p.category === category && p.name !== productDetails?.name);
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
  products={products} // Ensure this is passed correctly
  loading={loading}
/>
              ) : null}
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
