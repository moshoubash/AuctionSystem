// src/pages/ProductList.jsx
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import { ChevronDown } from 'lucide-react';

const ProductList = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: 'newest',
    priceRange: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let endpoint = '/products';
        let params = {};
        
        // Add category filter if specified
        if (categoryId) {
          params.category_id = categoryId;
          
          // Also fetch category details
          try {
            const categoryResponse = await api.get(`/categories/${categoryId}`);
            setCategory(categoryResponse.data);
          } catch (err) {
            console.error('Error fetching category:', err);
          }
        }
        
        // Add search query if specified
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        // Add sorting
        switch (filters.sort) {
          case 'newest':
            params.sort = 'created_at,desc';
            break;
          case 'price-low':
            params.sort = 'price,asc';
            break;
          case 'price-high':
            params.sort = 'price,desc';
            break;
          default:
            params.sort = 'created_at,desc';
        }
        
        // Add price range filter if not "all"
        if (filters.priceRange !== 'all') {
          const [min, max] = filters.priceRange.split('-');
          if (min) params.price_min = min;
          if (max) params.price_max = max;
        }
        
        const response = await api.get(endpoint, { params });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryId, searchQuery, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Get page title
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (category) {
      return category.name;
    }
    return 'All Products';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{getPageTitle()}</h1>
      
      {/* Filters */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <button 
            className="flex items-center text-sm mb-4 md:mb-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>Filter & Sort</span>
            <ChevronDown size={16} className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="text-sm text-gray-600">
            {products.length} products
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Sort dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select 
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-black"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            
            {/* Price range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select 
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-black"
              >
                <option value="all">All Prices</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-">$200 & Above</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Products grid */}
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
};

export default ProductList;