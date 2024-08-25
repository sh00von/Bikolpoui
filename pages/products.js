// pages/products.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout'; // Adjust the import path if necessary

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Filter state: 'all', 'BD', or 'IN'

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products'); // Adjust the URL if needed
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.results || []);
        setFilteredProducts(data.results || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.origin_country === filter));
    }
  }, [filter, products]);

  const totalProducts = products.length;
  const bdCount = products.filter(product => product.origin_country === 'BD').length;
  const inCount = products.filter(product => product.origin_country === 'IN').length;

  if (loading) {
    return (
      <Layout title="Products | BikOlpoo" description="View the list of products with their origin country information.">
        <div className="flex justify-center items-center min-h-screen bg-base-100">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Products | BikOlpoo" description="View and filter products based on their origin country.">
      <div className="min-h-screen p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center">Product List</h1>
        
        {/* Link to Homepage */}
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Homepage
          </Link>
        </div>
        
        {/* Stats Section */}
        <div className="stats stats-vertical lg:stats-horizontal shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-300 p-4 rounded-lg">
          <div className="stat place-items-center bg-base-300 p-4">
            <div className="stat-title">Total Products</div>
            <div className="stat-value text-3xl font-bold">{totalProducts}</div>
            <div className="stat-desc text-sm text-base-content">Overall count of products listed.</div>
          </div>

          <div className="stat place-items-center bg-base-300 p-4">
            <div className="stat-title">Bangladesh Products</div>
            <div className="stat-value text-3xl font-bold text-green-600">{bdCount}</div>
            <div className="stat-desc text-sm text-base-content">Products originating from Bangladesh.</div>
          </div>

          <div className="stat place-items-center bg-base-300 p-4">
            <div className="stat-title">Indian Products</div>
            <div className="stat-value text-3xl font-bold text-red-600">{inCount}</div>
            <div className="stat-desc text-sm text-base-content">Products originating from India.</div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <label htmlFor="filter" className="mr-2 text-base-content">Filter by Origin:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-base-300 rounded-md"
          >
            <option value="all">All</option>
            <option value="BD">Bangladesh</option>
            <option value="IN">India</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="w-full max-w-6xl overflow-x-auto bg-base-200 border border-base-300 rounded-lg shadow-md">
          <table className="min-w-full bg-base-100">
            <thead className="bg-base-300 border-b">
              <tr>
                <th className="p-4 text-left text-base-content">Name</th>
                <th className="p-4 text-left text-base-content">Origin Country</th>
                <th className="p-4 text-left text-base-content">Barcode</th>
                <th className="p-4 text-left text-base-content">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  // Determine row color based on origin country
                  const rowColor = product.origin_country === 'BD'
                    ? 'bg-green-800'
                    : product.origin_country === 'IN'
                    ? 'bg-red-800'
                    : 'bg-base-100'; // Default color

                  return (
                    <tr key={product.url} className={`border-b hover:bg-base-200 ${rowColor}`}>
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
                      <td className="p-4 text-base-content">{product.barcode || 'N/A'}</td>
                      <td className="p-4 text-base-content">{product.details || 'No details available'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-base-content">No products available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
