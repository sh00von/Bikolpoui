import { useEffect, useState, useCallback, useRef } from 'react';
import Fuse from 'fuse.js'; // Import fuse.js
import debounce from 'debounce';
import Layout from '../components/Layout';
import ProductTable from '../components/ProductTable';
import ProductStats from '../components/ProductStats';
import ProductFilter from '../components/ProductFilter';
import SearchInput from '../components/SearchInput';
import Spinner from '../components/Spinner';

const LOCAL_STORAGE_KEY = 'productData';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Filter state: 'all', 'BD', or 'IN'
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track the selected product
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const modalRef = useRef(null); // React ref for the modal

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
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

  const applyFilter = (products, filter) => {
    return filter === 'all'
      ? products
      : products.filter((product) => product.origin_country === filter);
  };

  useEffect(() => {
    setFilteredProducts(applyFilter(products, filter));
  }, [products, filter]);

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
      setSelectedProduct(null);
      setRelatedProducts([]);
      setLoading(false);
      return;
    }
  
    setSelectedProduct(product);
  
    // Extract related product URLs
    const relatedProductUrls = product.related_product || [];
  
    // Fetch related products based on the URLs
    const relatedProductsDetails = await Promise.all(
      relatedProductUrls.map(async (url) => {
        try {
          // Fetch the related product using its URL
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch related product from ${url}`);
          }
          const relatedProduct = await response.json();
  
          // Ensure that the related product is approved
          if (relatedProduct.approved) {
            return relatedProduct;
          }
        } catch (err) {
          console.error('Failed to fetch related product details:', err);
        }
        return null;
      })
    );
  
    // Filter out null values
    const filteredRelated = relatedProductsDetails.filter(r => r !== null);
  
    // Find additional related products in the same category
    const sameCategoryRelated = findRelatedProductsByCategory(product.category);
  
    // Combine related products from both sources
    const allRelatedProducts = [...filteredRelated, ...sameCategoryRelated];
  
    setRelatedProducts(allRelatedProducts);
    setLoading(false);
  
    if (modalRef.current) {
      modalRef.current.showModal(); // Open the modal
    }
  };
  

  const findRelatedProductsByCategory = (category) => {
    return products.filter(p => p.category === category && p.name !== selectedProduct?.name);
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

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setRelatedProducts([]);
    if (modalRef.current) {
      modalRef.current.close(); // Close the modal
    }
  };

  const totalProducts = products.length;
  const bdCount = products.filter(p => p.origin_country === 'BD').length;
  const inCount = products.filter(p => p.origin_country === 'IN').length;

  return (
    <Layout title="Home | BikOlpoo" description="Identify products from India and find Bangladeshi alternatives.">
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl bg-base-300 shadow-lg rounded-lg p-6">
          <h1 className="text-4xl font-bold mb-4 text-primary text-center">Products</h1>
          <ProductStats totalProducts={totalProducts} bdCount={bdCount} inCount={inCount} />
          <ProductFilter filter={filter} onFilterChange={(e) => setFilter(e.target.value)} />
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Spinner />
            </div>
          ) : (
            <ProductTable products={filteredProducts} onRowClick={(product) => checkProduct(product.name)} />
          )}
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
              ) : selectedProduct ? (
                <div className="mt-8 text-center">
                  <Link href="/products" className="text-blue-500 hover:underline">
                    View all products
                  </Link>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Modal */}
        <dialog ref={modalRef} className="modal modal-open">
          <div className="modal-box bg-base-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-4">Related Products</h3>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Spinner />
              </div>
            ) : relatedProducts.length > 0 ? (
              <ul className="space-y-4">
                {relatedProducts.map((product) => (
                  <li key={product.barcode} className="flex justify-between items-center">
                    <span>{product.name}</span>
                    <span>{product.details}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No related products found.</p>
            )}
            <div className="modal-action">
              <button className="btn" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </dialog>
      </div>
    </Layout>
  );
};

export default ProductsPage;
