import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrderDetailsQuery, useDeliverOrderMutation, usePayOrderMutation } from "../../redux/api/OrderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success("Order marked as delivered!");
  };

  const markAsPaidHandler = async () => {
    try {
      await payOrder({ orderId, details: { status: "Cash Received" } });
      refetch();
      toast.success("Order marked as paid!");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error?.data?.message || "Something went wrong"}</Messsage>
  ) : (
    <div className="container flex flex-col ml-[5rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {!order.order_items || order.order_items.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.order_items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product_id}`}>{item.title}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        $ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.users?.username}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.users?.email}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shipping_address?.address}, {order.shipping_address?.city}{" "}
            {order.shipping_address?.postalCode}, {order.shipping_address?.country}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.payment_method}
          </p>

          {order.is_paid ? (
            <Messsage variant="success">Paid on {new Date(order.paid_at).toLocaleDateString()}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid (Cash on Delivery)</Messsage>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>$ {order.items_price}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$ {order.shipping_price}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$ {order.tax_price}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>$ {order.total_price}</span>
        </div>

        {userInfo && userInfo.isAdmin && !order.is_paid && (
          <div className="mt-4">
            {loadingPay && <Loader />}
            <button
              type="button"
              className="bg-green-500 text-white w-full py-2 mb-2"
              onClick={markAsPaidHandler}
            >
              Mark As Paid (Cash Received)
            </button>
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.is_paid && !order.is_delivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;