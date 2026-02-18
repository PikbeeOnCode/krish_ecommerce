import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/OrderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <div className="container mx-auto px-4 ml-[5rem]">
        <AdminMenu />

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-6">All Orders ({orders?.length || 0})</h1>
            
            <div className="overflow-x-auto bg-[#1A1A1A] rounded-lg shadow-lg">
              <table className="w-full">
                <thead className="bg-[#2A2A2A] border-b border-gray-700">
                  <tr>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-gray-300">IMAGE</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-gray-300">ID</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-gray-300">USER</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-gray-300">DATE</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-gray-300">TOTAL</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-gray-300">PAID</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-gray-300">DELIVERED</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-gray-300">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {orders && orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr 
                        key={order._id || index} 
                        className="border-b border-gray-800 hover:bg-[#252525] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <img
                            src={order.orderItems?.[0]?.coverImage || "/placeholder.png"}
                            alt={order.orderItems?.[0]?.title || "Product"}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400 font-mono">
                            {order._id ? order._id.substring(0, 10) + "..." : "N/A"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm text-white">
                            {order.user?.username || "N/A"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-pink-500">
                            ${order.totalPrice || 0}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {order.isPaid ? (
                            <span className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
                              Completed
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {order.isDelivered ? (
                            <span className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
                              Completed
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <Link to={`/order/${order._id}`}>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors">
                              View Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-400">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderList;