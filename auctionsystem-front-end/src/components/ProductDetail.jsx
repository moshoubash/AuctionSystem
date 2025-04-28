// src/pages/ProductDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import ProductGrid from '../components/product/ProductGrid';
import { Minus, Plus } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch product details
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        
        // Fetch related products from same category
        if (response.data.category_id) {
          const relatedResponse = await api.get(`/products`, {
            params: {
              category_id: response.data.category_id,
              exclude: id,
              limit: 4
            }
          });
          setRelatedProducts(relatedResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const success = await addToCart(product.id, quantity);
    setAddingToCart(false);
    
    if (success) {
      // Show success message or redirect to cart
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product image */}
        <div className="bg-gray-100">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-auto object-cover"
            />
          ) : (
            <img 
              src="/api/placeholder/600/800" 
              alt={product.name} 
              className="w-full h-auto object-cover"
            />
          )}
        </div>
        
        {/* Product info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl font-medium mb-4">${product.price}</p>
          
          {/* Stock status */}
          <div className="mb-4">
            {product.stock_quantity > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
          
          {/* Description */}
          <div className="prose max-w-none mb-8">
            <p>{product.description || 'No description available for this product.'}</p>
          </div>
          
          {/* Quantity selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4">Quantity:</span>
            <div className="flex items-center border border-gray-300">
              <button 
                onClick={() => handleQuantityChange(-1)} 
                className="px-4 py-2"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)} 
                className="px-4 py-2"
                disabled={quantity >= product.stock_quantity}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock_quantity <= 0}
            className="bg-black text-white py-3 px-6 w-full md:w-1/2 disabled:bg-gray-400"
          >
            {addingToCart ? 'ADDING...' : 'ADD TO BAG'}
          </button>
        </div>
      </div>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;