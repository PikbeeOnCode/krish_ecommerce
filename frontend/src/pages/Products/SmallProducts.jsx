import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProducts = ({ product }) => {
  return (
    <div className="w-[15rem] p-2">
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.coverImage || product.image}
              alt={product.title || product.name}
              className="w-full h-[250px] object-cover"
            />
          </Link>
          <HeartIcon product={product} />
        </div>

        <div className="p-4 bg-gray-900">
          <Link to={`/product/${product._id}`}>
            <h2 className="text-white text-base font-medium mb-2 hover:text-pink-500 transition-colors truncate">
              {product.title || product.name}
            </h2>
          </Link>

          {product.createdAt && (
            <p className="text-gray-400 text-xs mb-3">
              {new Date(product.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          )}

          <div className="flex justify-center">
            <span className="text-pink-500 text-xl font-bold">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallProducts;