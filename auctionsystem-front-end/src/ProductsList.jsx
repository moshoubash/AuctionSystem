import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Define the API base URL
    const API_BASE_URL = "http://localhost:8000/api";

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products and categories simultaneously
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/categories`),
        ]);

        if (productsResponse.data.status) {
          setProducts(productsResponse.data.products);
        }

        if (categoriesResponse.data.status) {
          setCategories(categoriesResponse.data.categories);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => product.category_id === parseInt(selectedCategory)
        );

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return <div className="text-center my-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 my-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      {/* Category Filter */}
      <div className="mb-6">
        <label htmlFor="category" className="mr-2 font-medium">
          Filter by category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-25 h-25 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

                {product.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mb-2">
                    {product.category.name}
                  </span>
                )}

                <p className="text-gray-700 mb-2 line-clamp-2">
                  {product.description || "No description available"}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">${product.price}</span>

                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={product.stock_quantity < 1}
                  >
                    {product.stock_quantity > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} in stock`
                    : "Currently unavailable"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
