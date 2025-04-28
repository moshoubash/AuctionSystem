// src/components/product/ProductCard.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <div className="group relative">
      <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-sm bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
          />
        ) : (
          <img
            src="/api/placeholder/400/500"
            alt={product.name}
            className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
          />
        )}
        {/* Quick add button */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleAddToCart}
            className="w-full text-center text-sm font-medium"
          >
            ADD TO BAG
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0"></span>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category_name}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;