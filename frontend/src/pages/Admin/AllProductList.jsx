import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAllProductsQuery } from '../../redux/api/productApiSlice';
import AdminMenu from './AdminMenu';
import Loader from '../../components/Loader';

const AllProductsList = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) return <Loader />;
  
  if (isError) {
    return (
      <div className="py-12 text-center text-red-600">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          All Products
          <span className="ml-3 text-gray-500 font-medium text-xl">
            ({products?.length || 0})
          </span>
        </h1>

        {/* Optional: Add new product button */}
        <Link
          to="/admin/productlist"
          className="inline-flex items-center px-5 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium shadow-sm"
        >
          + Add New Product
        </Link>
      </div>

      {/* Products Grid */}
      {products?.length === 0 ? (
        <div className="py-16 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-lg">No products found</p>
          <p className="mt-2">Start by adding your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-200 flex flex-col h-full"
            >
              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/images/fallback-product.jpg'; // ← add your fallback image
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1.5 min-h-[2.8rem]">
                  {product.title}
                </h3>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {moment(product.createdAt).format('MMM D, YYYY')}
                    </span>
                    <span className="font-bold text-pink-600">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to={`/admin/product/update/${product._id}`}
                    className="block w-full text-center py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Edit Product
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProductsList;