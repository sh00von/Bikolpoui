import { useEffect, useState, useRef, useCallback } from 'react';
import Layout from '../components/Layout';
import ProductTable from '../components/ProductTable';
import ProductStats from '../components/ProductStats';
import ProductFilter from '../components/ProductFilter';
import Spinner from '../components/Spinner';

const LOCAL_STORAGE_KEY = 'productData';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Filter state: 'all', 'BD', or 'IN'
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track the selected product
  const [relatedProducts, setRelatedProducts] = useState([]); // State to track related products

  const modalRef = useRef(null); // React ref for the modal

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const cachedTime = localStorage.getItem(`${LOCAL_STORAGE_KEY}_timestamp`);
        
        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_EXPIRY_TIME)) {
          const parsedData = JSON.parse(cachedData);
          setProducts(parsedData);
          setFilteredProducts(applyFilter(parsedData, filter));
        } else {
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_timestamp`, Date.now().toString());
          setProducts(data);
          setFilteredProducts(applyFilter(data, filter));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filter]);

  const applyFilter = (products, filter) => {
    return filter === 'all'
      ? products
      : products.filter((product) => product.origin_country === filter);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    checkProduct(product.name); // Ensure related products are fetched when a row is clicked
    if (modalRef.current) {
      modalRef.current.showModal(); // Open the modal
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setRelatedProducts([]);
    if (modalRef.current) {
      modalRef.current.close(); // Close the modal
    }
  };

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
  
    // Find related products from related_product field
    const related = product.related_product || [];
    console.log('Related Products:', related); // Log related products
  
    // Fetch related product details
    const relatedProductsDetails = await Promise.all(
      related.map(async (relatedProduct) => {
        try {
          return products.find(p => p.id === relatedProduct.id); // Find full product details
        } catch (err) {
          console.error('Failed to fetch related product details:', err);
          return null;
        }
      })
    );
  
    // Filter out null values and products not meeting criteria
    const filteredRelated = relatedProductsDetails
      .filter(r => r !== null && r.id !== product.id); // Exclude the selected product
  
    // Find additional related products in the same category
    const sameCategoryRelated = findRelatedProductsByCategory(product.category)
      .filter(p => p.id !== product.id); // Exclude the selected product
  
    // Combine related products from both sources
    const allRelatedProducts = [...filteredRelated, ...sameCategoryRelated];
  
    setRelatedProducts(allRelatedProducts);
    setLoading(false);
  };
  

  const findRelatedProductsByCategory = (category) => {
    return products.filter(p => p.category === category && p.name !== selectedProduct?.name);
  };

  const totalProducts = products.length;
  const bdCount = products.filter(p => p.origin_country === 'Bangladesh').length;
  const inCount = products.filter(p => p.origin_country === 'India').length;

  return (
    <Layout title="Products | BikOlpoo" description="Identify products from India and find Bangladeshi alternatives.">
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-4xl font-bold text-primary mb-6">Products</h1>
        <div className="w-full max-w-4xl">
          <ProductStats totalProducts={totalProducts} bdCount={bdCount} inCount={inCount} />
          <ProductFilter filter={filter} onFilterChange={handleFilterChange} />
          {loading ? (
            <div className="text-center text-lg text-gray-500 mt-6">Loading...</div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onRowClick={handleRowClick}
              getRowClass={(product) => product.origin_country === 'India' ? 'bg-red-800 text-white' : 'bg-green-800 text-white'} // Apply background color based on origin country
            />
          )}
          <dialog ref={modalRef} className="modal">
            <div className="modal-box bg-base-100 p-6 rounded-lg shadow-lg">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Spinner />
                </div>
              ) : selectedProduct ? (
                <>
                  <h3 className="text-xl font-bold text-primary mb-4">{selectedProduct.name}</h3>
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium text-base-content">Origin Country:</span>
                      <span className="ml-2 text-base-content">{selectedProduct.origin_country}</span>
                      {selectedProduct.origin_country === 'BD' && (
                        <img
                          src="https://flagsapi.com/BD/shiny/32.png"
                          alt="Bangladesh Flag"
                          className="ml-2 w-6 h-6"
                        />
                      )}
                      {selectedProduct.origin_country === 'India' && (
                        <img
                          src="https://flagsapi.com/IN/shiny/32.png"
                          alt="India Flag"
                          className="ml-2 w-6 h-6"
                        />
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-base-content">Category:</span>
                      <span className="ml-2 text-base-content">{selectedProduct.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-base-content">Barcode:</span>
                      <span className="ml-2 text-base-content">{selectedProduct.barcode || 'N/A'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium text-base-content">Details:</span>
                      <span className="ml-2 text-base-content">{selectedProduct.details || 'N/A'}</span>
                    </div>
                  </div>
                  {selectedProduct.origin_country === 'India' && (
                    <div className="mb-4 p-4 bg-red-800 border rounded-lg">
                      <p className="text-base-content">This product is from India. Consider using products from Bangladesh for better alternatives.</p>
                    </div>
                  )}
                  <h4 className="text-lg font-semibold text-primary mb-2">Related Products:</h4>
                  {relatedProducts.length > 0 ? (
                    <ul className="space-y-4">
                      {relatedProducts.map((product) => (
                        <li key={product.id} className={`flex items-center ${product.origin_country === 'India' ? 'bg-red-800' : 'bg-green-800'} space-x-4 py-2 px-4 bg-base-200 rounded-lg shadow-sm`}>
                          <img
                            src={`https://flagsapi.com/${product.origin_country === 'Bangladesh' ? 'BD' : 'IN'}/shiny/32.png`}
                            alt={`${product.origin_country} Flag`}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-lg">{product.name}</span>
                            <span className="text-sm text-gray-500">{product.origin_country}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No related products found.</p>
                  )}
                </>
              ) : (
                <p className="text-center py-4 text-base-content">No product selected.</p>
              )}
              <div className="modal-action">
                <button className="btn" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
