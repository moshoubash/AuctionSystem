import React, { useState } from "react";
import { ShoppingCart, Heart, Eye, ArrowRight } from "lucide-react";

export default function Home() {
  const [hoverStates, setHoverStates] = useState({});

  // Handle hover state for product cards
  const handleMouseEnter = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  const Hero = () => (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img
          src="/api/placeholder/1920/1080"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
            NEW COLLECTION
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Elevate Your <span className="text-red-400">Style</span> with
            Premium Tees
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg">
            Discover our curated collection of premium, sustainably-sourced
            t-shirts designed for comfort and style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition font-medium flex items-center justify-center">
              Shop Collection <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition font-medium">
              Learn More
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <img
              src="/api/placeholder/500/600"
              alt="Featured T-shirt"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg">
              <span className="text-lg font-bold">30% OFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const Categories = () => {
    const categories = [
      { name: "Men", icon: "👔" },
      { name: "Women", icon: "👚" },
      { name: "Kids", icon: "🧸" },
      { name: "Graphic Tees", icon: "🎨" },
      { name: "Oversized", icon: "📏" },
      { name: "Limited Edition", icon: "✨" },
    ];

    return (
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <span className="text-red-500 font-semibold mb-2">BROWSE</span>
            <h2 className="text-3xl font-bold text-center mb-4">
              Shop by Category
            </h2>
            <div className="w-24 h-1 bg-red-500 rounded"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col items-center bg-gray-50 p-6 rounded-xl hover:shadow-lg transition cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-medium text-gray-800">{cat.name}</h3>
                <div className="w-0 group-hover:w-full h-0.5 bg-red-500 mt-2 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const FeaturedProducts = () => {
    const products = [
      {
        id: 1,
        name: "Vintage Washed Tee",
        price: "$19.99",
        rating: 4.8,
        reviews: 124,
        image:
          "https://www.swims.com/cdn/shop/products/SWY344IN-100-1.jpg?v=1691161885",
      },
      {
        id: 2,
        name: "Abstract Graphic Tee",
        price: "$24.99",
        rating: 4.6,
        reviews: 98,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSckPRbSab7dmhvlA6zjp8E9HlAJEgDo358uQ&s",
      },
      {
        id: 3,
        name: "Premium White Tee",
        price: "$14.99",
        rating: 4.9,
        reviews: 213,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ2oaxZRi-AHbTN7thyAuFjDt6h8jtbdwJmw&s",
      },
      {
        id: 4,
        name: "Classic Black Tee",
        price: "$14.99",
        rating: 4.7,
        reviews: 156,
        image:
          "https://www.shutterstock.com/image-photo/kids-jacket-isolated-closeup-trendy-260nw-2119407203.jpg",
      },
    ];

    const renderStars = (rating) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          stars.push(
            <span key={i} className="text-yellow-400">
              ★
            </span>
          );
        } else if (i === fullStars && hasHalfStar) {
          stars.push(
            <span key={i} className="text-yellow-400">
              ★
            </span>
          );
        } else {
          stars.push(
            <span key={i} className="text-gray-300">
              ★
            </span>
          );
        }
      }

      return stars;
    };

    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <span className="text-red-500 font-semibold mb-2">TOP PICKS</span>
            <h2 className="text-3xl font-bold text-center mb-4">
              Featured Products
            </h2>
            <div className="w-24 h-1 bg-red-500 rounded"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={() => handleMouseLeave(product.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover transition-transform duration-700 ease-in-out transform hover:scale-110"
                  />
                  {hoverStates[product.id] && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-70 flex justify-between transition-opacity duration-300">
                      <button className="bg-white text-gray-800 p-2 rounded-full hover:bg-red-500 hover:text-white transition">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                      <button className="bg-white text-gray-800 p-2 rounded-full hover:bg-red-500 hover:text-white transition">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="bg-white text-gray-800 p-2 rounded-full hover:bg-red-500 hover:text-white transition">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center text-sm mb-1">
                    {renderStars(product.rating)}
                    <span className="text-gray-500 ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-red-500 font-bold mt-1">{product.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button className="border border-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-800 hover:text-white hover:border-gray-800 transition font-medium flex items-center">
              View All Products <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  };

  const Newsletter = () => (
    <section className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
        <p className="text-gray-300 mb-8 max-w-lg">
          Subscribe to get special offers, free giveaways, and
          once-in-a-lifetime deals.
        </p>
        <div className="flex flex-col sm:flex-row w-full max-w-lg gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
          />
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </div>
  );
}
