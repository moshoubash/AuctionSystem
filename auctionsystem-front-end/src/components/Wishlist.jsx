import { Link } from "react-router-dom";

// Wishlist Component
const Wishlist = ({ wishlistItems, addToCart, toggleWishlist }) => {
    if (wishlistItems.length === 0) {
      return (
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500">Your wishlist is empty</p>
            <Link to="/" className="inline-block mt-4 px-6 py-2 bg-black text-white font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map(product => (
            <div key={product.id} className="relative">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                
                <button 
                  className="absolute top-2 right-2 z-10"
                  onClick={() => toggleWishlist(product)}
                >
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-2">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm font-bold mt-1">${product.price.toFixed(2)}</p>
                <button 
                  className="mt-2 w-full bg-black text-white py-2"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Wishlist;