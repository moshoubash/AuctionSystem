import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../../services/api';
import ProductCard from './ProductCard';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentCategory = searchParams.get('category_id') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category_id: currentCategory,
        search: currentSearch,
        page: currentPage
      };
      
      const response = await productService.getProducts(params);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSearchParams(prev => {
      if (categoryId) {
        prev.set('category_id', categoryId);
      } else {
        prev.delete('category_id');
      }
      prev.delete('page');
      return prev;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (currentSearch) {
        prev.set('search', currentSearch);
      } else {
        prev.delete('search');
      }
      prev.delete('page');
      return prev;
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(prev => {
      if (value) {
        prev.set('search', value);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        
        <div className="filters">
          <div className="category-filter">
            <select 
              value={currentCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={currentSearch}
              onChange={handleSearchChange}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.data?.length > 0 ? (
        <>
          <div className="products-grid">
            {products.data.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {products.last_page > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {products.last_page}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === products.last_page}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-products">No products found</div>
      )}
    </div>
  );
};

export default ProductsList;