import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../../redux/api/OrderApiSlice";

const EsewaModal = ({ amount, onSuccess, onClose }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[350px] overflow-hidden">
        <div className="bg-[#60BB46] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-[#60BB46] font-bold text-sm">e</span>
            </div>
            <span className="text-white font-bold text-lg">esewa</span>
          </div>
          <button onClick={onClose} className="text-white text-xl font-bold">×</button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Pay <strong className="text-[#60BB46]">Rs {amount}</strong> securely with eSewa
              </p>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="text-gray-600 text-sm block mb-1">eSewa ID</label>
                  <input
                    type="text"
                    placeholder="Mobile number or eSewa ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm text-black focus:outline-none focus:border-[#60BB46]"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-gray-600 text-sm block mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm text-black focus:outline-none focus:border-[#60BB46]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#60BB46] text-white py-2 rounded font-semibold hover:bg-[#4ea336] transition"
                >
                  {loading ? "Verifying..." : "Login"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-2 text-center">
                OTP sent to your registered mobile number
              </p>
              <p className="text-gray-400 text-xs mb-4 text-center">
                Use any 6 digit number as OTP 😄
              </p>
              <form onSubmit={handleOtp}>
                <div className="mb-4">
                  <label className="text-gray-600 text-sm block mb-1">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="6 digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm text-black focus:outline-none focus:border-[#60BB46] tracking-widest text-center text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#60BB46] text-white py-2 rounded font-semibold hover:bg-[#4ea336] transition"
                >
                  {loading ? "Processing Payment..." : "Confirm Payment"}
                </button>
              </form>
            </>
          )}

          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="text-gray-400 text-xs">Secured by</span>
            <span className="text-[#60BB46] font-bold text-xs">eSewa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const { id: orderId } = useParams();
  const [showEsewa, setShowEsewa] = useState(false);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success("Order marked as delivered!");
  };

  const handleEsewaSuccess = async () => {
    try {
      await payOrder({
        orderId,
        details: {
          id: `ESEWA-${Date.now()}`,
          status: "COMPLETED",
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
      });
      setShowEsewa(false);
      refetch();
      toast.success("Payment successful! 🎉");
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

      {showEsewa && (
        <EsewaModal
          amount={order.totalPrice}
          onSuccess={handleEsewaSuccess}
          onClose={() => setShowEsewa(false)}
        />
      )}

      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
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
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.title}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        Rs {(item.qty * item.price).toFixed(2)}
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
            <strong className="text-pink-500">Name:</strong> {order.user.username}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong> {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Messsage variant="success">Paid on {order.paidAt}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid</Messsage>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>Rs {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>Rs {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>Rs {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>Rs {order.totalPrice}</span>
        </div>

        {/* eSewa button - only for non-admin users */}
        {!order.isPaid && userInfo && !userInfo.isAdmin && (
          <div className="mt-4">
            {loadingPay && <Loader />}
            <button
              onClick={() => setShowEsewa(true)}
              className="w-full bg-[#60BB46] text-white py-3 rounded font-semibold flex items-center justify-center gap-2 hover:bg-[#4ea336] transition"
            >
              <span className="bg-white text-[#60BB46] rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">e</span>
              Pay with eSewa
            </button>
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div className="mt-4">
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