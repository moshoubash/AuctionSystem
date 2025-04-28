import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";

// Category Page Component
const CategoryPage = ({ addToCart, toggleWishlist, wishlistItems }) => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy category products
  const dummyCategoryProducts = {
    clothes: [
      {
        id: 1,
        name: "Patterned Dress",
        price: 29.99,
        image_url: "/api/placeholder/400/600",
        category: { id: 1, name: "Clothes" },
        stock_quantity: 15,
      },
      {
        id: 2,
        name: "Embroidered Kaftan",
        price: 39.99,
        image_url: "/api/placeholder/400/600",
        category: { id: 1, name: "Clothes" },
        stock_quantity: 8,
      },
    ],
    shoes: [
      {
        id: 5,
        name: "Canvas Espadrilles",
        price: 24.99,
        image_url: "/api/placeholder/400/600",
        category: { id: 2, name: "Shoes" },
        stock_quantity: 20,
      },
      {
        id: 6,
        name: "Braided Sandals",
        price: 19.99,
        image_url: "/api/placeholder/400/600",
        category: { id: 2, name: "Shoes" },
        stock_quantity: 12,
      },
    ],
    sport: [
      {
        id: 7,
        name: "Quick-dry Sports Top",
        price: 14.99,
        image_url: "/api/placeholder/400/600",
        category: { id: 3, name: "Sport" },
        stock_quantity: 25,
      },
    ],
    beauty: [
      {
        id: 8,
        name: "Facial Mist",
        price: 9.99,
        image_url: "/api/placeholder/400/600",
        category: { id: 4, name: "Beauty" },
        stock_quantity: 30,
      },
    ],
    underwear: [
      {
        id: 9,
        name: "Cotton Pajama Set",
        price: 24.99,
        image_url: "/api/placeholder/400/600",
        category: { id: 5, name: "Underwear" },
        stock_quantity: 18,
      },
    ],
    home: [
      {
        id: 10,
        name: "Patterned Cushion Cover",
        price: 12.99,
        image_url: "/api/placeholder/400/600",
        category: { id: 6, name: "Home" },
        stock_quantity: 22,
      },
    ],
  };

  useEffect(() => {
    // Simulate fetching products by category
    const fetchCategoryProducts = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const categoryProducts = dummyCategoryProducts[categoryName] || [];
      setProducts(categoryProducts);
      setLoading(false);
    };

    fetchCategoryProducts();
  }, [categoryName]);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 uppercase">{categoryName}</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              isWishlisted={wishlistItems.some(
                (item) => item.id === product.id
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

