import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[20rem] p-3 relative group">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <img
          src={product.coverImage}
          alt={product.title}
          className="w-full h-[26rem] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
        <HeartIcon product={product} />
        
        {/* Stock Badge */}
        {product.countInStock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full">
          ${product.price}
        </div>
      </div>

      <div className="mt-3">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors line-clamp-2 mb-1">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          by {product.author}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {product.ratings > 0 ? product.ratings.toFixed(1) : "New"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.numReviews})
            </span>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {product.countInStock > 0 ? (
              <span className="text-green-600 dark:text-green-400 font-medium">
                In Stock: {product.countInStock}
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400 font-medium">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;