import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductGrid from "../components/product/ProductGrid";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products (newest 8)
        const productsResponse = await api.get(
          "/products?limit=8&sort=created_at,desc"
        );
        setFeaturedProducts(productsResponse.data);

        // Fetch categories
        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Failed to load content. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero section */}
      <div className="relative h-screen">
        <img
          src="/api/placeholder/1920/1080"
          alt="New Arrivals"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">New Arrivals</h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover the latest trends in fashion
          </p>
          <Link
            to="/products"
            className="bg-white text-black px-8 py-3 font-medium"
          >
            SHOP NOW
          </Link>
        </div>
      </div>

      {/* Featured products section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">NEW ARRIVALS</h2>
        <ProductGrid
          products={featuredProducts}
          loading={loading}
          error={error}
        />

        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-block border border-black px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors"
          >
            VIEW ALL
          </Link>
        </div>
      </div>

      {/* Categories section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            SHOP BY CATEGORY
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <p className="col-span-full text-center">Loading categories...</p>
            ) : error ? (
              <p className="col-span-full text-center text-red-500">{error}</p>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products/category/${category.id}`}
                  className="relative group overflow-hidden"
                >
                  <img
                    src="/api/placeholder/500/600"
                    alt={category.name}
                    className="w-full h-80 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all">
                    <h3 className="text-white text-2xl font-bold">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">JOIN OUR NEWSLETTER</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sign up for our newsletter to receive updates on new arrivals, special
          offers and other discount information.
        </p>
        <form className="flex flex-col md:flex-row justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="px-4 py-3 w-full border border-gray-300 focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 mt-2 md:mt-0 md:ml-2"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
