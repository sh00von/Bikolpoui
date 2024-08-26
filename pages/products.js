import { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import ProductTable from '../components/ProductTable';
import ProductStats from '../components/ProductStats';
import Spinner from '../components/Spinner';

const LOCAL_STORAGE_KEY = 'productData';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOrigin, setSelectedOrigin] = useState('All');

  const modalRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const cachedTime = localStorage.getItem(`${LOCAL_STORAGE_KEY}_timestamp`);
        
        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_EXPIRY_TIME)) {
          const parsedData = JSON.parse(cachedData);
          setProducts(parsedData);
        } else {
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_timestamp`, Date.now().toString());
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    checkProduct(product.name);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setRelatedProducts([]);
    if (modalRef.current) {
      modalRef.current.close();
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
  
    const related = product.related_product || [];
    const relatedProductsDetails = await Promise.all(
      related.map(async (relatedProduct) => {
        try {
          return products.find(p => p.id === relatedProduct.id);
        } catch (err) {
          console.error('Failed to fetch related product details:', err);
          return null;
        }
      })
    );
  
    const filteredRelated = relatedProductsDetails
      .filter(r => r !== null && r.id !== product.id);
  
    const sameCategoryRelated = findRelatedProductsByCategory(product.category)
      .filter(p => p.id !== product.id);
  
    const allRelatedProducts = [...filteredRelated, ...sameCategoryRelated];
  
    setRelatedProducts(allRelatedProducts);
    setLoading(false);
  };

  const findRelatedProductsByCategory = (category) => {
    return products.filter(p => p.category === category && p.name !== selectedProduct?.name);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleOriginChange = (event) => {
    setSelectedOrigin(event.target.value);
  };

  // Filtered products based on selected filters
  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => selectedOrigin === 'All' || p.origin_country === selectedOrigin);

  // Counter stats based on all products
  const totalProducts = products.length;
  const bdCount = products.filter(p => p.origin_country === 'Bangladesh').length;
  const inCount = products.filter(p => p.origin_country === 'India').length;

  return (
    <Layout title="Products | BikOlpoo" description="Identify products from India and find Bangladeshi alternatives.">
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-4xl font-bold text-primary mb-6">Products</h1>
        
 
        
        <div className="w-full max-w-4xl">
          <ProductStats totalProducts={totalProducts} bdCount={bdCount} inCount={inCount} />
          <div className="flex justify-center mb-6">
  <div className="flex space-x-4">
    <div className="flex items-center">
      <label htmlFor="category-filter" className="mr-2">Category:</label>
      <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange} className="p-2 border border-gray-300 rounded">
        <option value="All">All</option>
        <option value="Personal Care Products">Personal Care Products</option>
        <option value="Beverages">Beverages</option>
        {/* Add more categories here */}
      </select>
    </div>

    <div className="flex items-center">
      <label htmlFor="origin-filter" className="mr-2">Origin:</label>
      <select id="origin-filter" value={selectedOrigin} onChange={handleOriginChange} className="p-2 border border-gray-300 rounded">
        <option value="All">All</option>
        <option value="Bangladesh">Bangladesh</option>
        <option value="India">India</option>
      </select>
    </div>
  </div>
</div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
                  <Spinner />
                </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onRowClick={handleRowClick}
              getRowClass={(product) => product.origin_country === 'India' ? 'bg-red-800 text-white' : 'bg-green-800 text-white'}
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
                      {selectedProduct.origin_country === 'Bangladesh' && (
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
                        <li key={product.id} className={`flex items-center ${product.origin_country === 'India' ? 'bg-red-800' : 'bg-green-800'} p-4 rounded`}>
                          <span className="text-white">{product.name}</span>
                          {product.origin_country === 'Bangladesh' && (
                            <img
                              src="https://flagsapi.com/BD/shiny/32.png"
                              alt="Bangladesh Flag"
                              className="ml-2 w-6 h-6"
                            />
                          )}
                          {product.origin_country === 'India' && (
                            <img
                              src="https://flagsapi.com/IN/shiny/32.png"
                              alt="India Flag"
                              className="ml-2 w-6 h-6"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base-content">No related products found.</p>
                  )}
                  <div className="mt-6 flex justify-end">
                    <button className="btn btn-primary" onClick={handleCloseModal}>Close</button>
                  </div>
                </>
              ) : (
                <p>No product selected</p>
              )}
            </div>
          </dialog>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
