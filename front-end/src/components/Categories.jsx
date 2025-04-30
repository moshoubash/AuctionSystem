import { useState } from 'react';
import { Sliders, ShoppingBag, Star, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// Fake product data
const products = [
  {
    id: 1,
    name: "Classic White Sneakers",
    price: 89.99,
    category: "footwear",
    rating: 4.5,
    image: "/api/placeholder/300/300",
    brand: "StrideRight",
    inStock: true,
    onSale: false
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 69.99,
    category: "clothing",
    rating: 4.2,
    image: "/api/placeholder/300/300",
    brand: "DenimCo",
    inStock: true,
    onSale: true
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 129.99,
    category: "electronics",
    rating: 4.8,
    image: "/api/placeholder/300/300",
    brand: "SoundWave",
    inStock: true,
    onSale: false
  },
  {
    id: 4,
    name: "Leather Wallet",
    price: 49.99,
    category: "accessories",
    rating: 4.0,
    image: "/api/placeholder/300/300",
    brand: "LeatherCraft",
    inStock: false,
    onSale: false
  },
  {
    id: 5,
    name: "Smart Watch",
    price: 199.99,
    category: "electronics",
    rating: 4.7,
    image: "/api/placeholder/300/300",
    brand: "TechGear",
    inStock: true,
    onSale: true
  },
  {
    id: 6,
    name: "Cotton T-Shirt",
    price: 24.99,
    category: "clothing",
    rating: 4.3,
    image: "/api/placeholder/300/300",
    brand: "BasicTees",
    inStock: true,
    onSale: false
  },
  {
    id: 7,
    name: "Running Shoes",
    price: 119.99,
    category: "footwear",
    rating: 4.6,
    image: "/api/placeholder/300/300",
    brand: "StrideRight",
    inStock: true,
    onSale: false
  },
  {
    id: 8,
    name: "Sunglasses",
    price: 79.99,
    category: "accessories",
    rating: 4.1,
    image: "/api/placeholder/300/300",
    brand: "VisionStyle",
    inStock: true,
    onSale: true
  }
];

// Categories data
const categories = [
  { id: "all", name: "All Products" },
  { id: "clothing", name: "Clothing" },
  { id: "footwear", name: "Footwear" },
  { id: "electronics", name: "Electronics" },
  { id: "accessories", name: "Accessories" }
];

// Brands data
const brands = [
  { id: "all", name: "All Brands" },
  { id: "StrideRight", name: "StrideRight" },
  { id: "DenimCo", name: "DenimCo" },
  { id: "SoundWave", name: "SoundWave" },
  { id: "LeatherCraft", name: "LeatherCraft" },
  { id: "TechGear", name: "TechGear" },
  { id: "BasicTees", name: "BasicTees" },
  { id: "VisionStyle", name: "VisionStyle" }
];

// Filter component
const FilterSection = ({ title, children, isOpen, toggle }) => {
  return (
    <div className="mb-6">
      <div 
        className="flex justify-between items-center mb-2 cursor-pointer" 
        onClick={toggle}
      >
        <h3 className="font-medium text-lg">{title}</h3>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-60' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
};

// Main component
export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState(200);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  
  // Filter open/close state
  const [openFilters, setOpenFilters] = useState({
    categories: true,
    brands: true,
    price: true,
    availability: true,
    rating: true
  });

  const toggleFilter = (filter) => {
    setOpenFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Mobile filter drawer state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Apply filters to products
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    
    // Brand filter
    if (selectedBrand !== "all" && product.brand !== selectedBrand) return false;
    
    // Price filter
    if (product.price > priceRange) return false;
    
    // Availability filters
    if (inStockOnly && !product.inStock) return false;
    if (onSaleOnly && !product.onSale) return false;
    
    // Rating filter
    if (product.rating < minRating) return false;
    
    return true;
  });

  // Filters sidebar for desktop and mobile
  const FiltersContent = () => (
    <div className="space-y-4">
      <FilterSection 
        title="Categories" 
        isOpen={openFilters.categories} 
        toggle={() => toggleFilter('categories')}
      >
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center">
              <input
                type="radio"
                id={`category-${category.id}`}
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => setSelectedCategory(category.id)}
                className="mr-2"
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection 
        title="Brands" 
        isOpen={openFilters.brands}
        toggle={() => toggleFilter('brands')}
      >
        <div className="space-y-2">
          {brands.map(brand => (
            <div key={brand.id} className="flex items-center">
              <input
                type="radio"
                id={`brand-${brand.id}`}
                name="brand"
                checked={selectedBrand === brand.id}
                onChange={() => setSelectedBrand(brand.id)}
                className="mr-2"
              />
              <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection 
        title="Price Range" 
        isOpen={openFilters.price}
        toggle={() => toggleFilter('price')}
      >
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="200"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between">
            <span>$0</span>
            <span>${priceRange}</span>
            <span>$200</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection 
        title="Availability" 
        isOpen={openFilters.availability}
        toggle={() => toggleFilter('availability')}
      >
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in-stock"
              checked={inStockOnly}
              onChange={() => setInStockOnly(!inStockOnly)}
              className="mr-2"
            />
            <label htmlFor="in-stock">In Stock Only</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="on-sale"
              checked={onSaleOnly}
              onChange={() => setOnSaleOnly(!onSaleOnly)}
              className="mr-2"
            />
            <label htmlFor="on-sale">On Sale</label>
          </div>
        </div>
      </FilterSection>

      <FilterSection 
        title="Rating" 
        isOpen={openFilters.rating}
        toggle={() => toggleFilter('rating')}
      >
        <div className="space-y-2">
          {[0, 3, 3.5, 4, 4.5].map(rating => (
            <div key={rating} className="flex items-center">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
                className="mr-2"
              />
              <label htmlFor={`rating-${rating}`} className="flex items-center">
                {rating === 0 ? (
                  "Any Rating"
                ) : (
                  <>
                    {rating}+ <Star size={16} className="ml-1 text-yellow-400 inline" />
                  </>
                )}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Navbar */}
      <Navbar />
      {/* Header */}
      <div className="py-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Shop All Products</h1>
        <p className="mt-2 text-gray-500">Browse our collection of high-quality products</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 pt-6">
        {/* Mobile filter button */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Sliders size={18} />
            <span>Filters</span>
          </button>
          <span className="text-sm text-gray-500">
            {filteredProducts.length} results
          </span>
        </div>

        {/* Mobile filter drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div 
              className="fixed inset-0 bg-black bg-opacity-25" 
              onClick={() => setShowMobileFilters(false)}
            ></div>
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-xl flex flex-col overflow-y-auto px-4 py-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Filters</h2>
                <button 
                  className="text-gray-400" 
                  onClick={() => setShowMobileFilters(false)}
                >
                  ✕
                </button>
              </div>
              <FiltersContent />
              <div className="mt-6">
                <button 
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop sidebar filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <h2 className="text-lg font-medium mb-4">Filters</h2>
          <FiltersContent />
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <div className="hidden md:flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Sort by:</span>
              <select className="border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                    {product.onSale && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        SALE
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                        <span className="font-medium text-red-600">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400" fill="currentColor" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="font-medium text-gray-900">${product.price.toFixed(2)}</div>
                      <button className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 text-sm">
                        <ShoppingBag size={16} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}