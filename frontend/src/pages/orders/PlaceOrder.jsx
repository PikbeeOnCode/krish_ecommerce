import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/OrderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    console.log("Place Order Button Clicked");
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  // empty cart UI
  if (cart.cartItems.length === 0) {
    return (
      <>
        <ProgressSteps step1 step2 step3 />
        <div className="container mx-auto mt-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="text-6xl">🛒</div>
          <h2 className="text-2xl font-semibold">Your cart is empty!</h2>
          <p className="text-gray-400">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/shop"
            className="bg-pink-500 text-white py-2 px-8 rounded-full text-lg hover:bg-pink-600 transition"
          >
            Go to Shop
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <td className="px-1 py-2 text-left align-top">Image</td>
                <td className="px-1 py-2 text-left">Product</td>
                <td className="px-1 py-2 text-left">Quantity</td>
                <td className="px-1 py-2 text-left">Price</td>
                <td className="px-1 py-2 text-left">Total</td>
              </tr>
            </thead>
            <tbody>
              {cart.cartItems.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="p-2">
                    <Link to={`/product/${item._id}`}>{item.title}</Link>
                  </td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">{item.price.toFixed(2)}</td>
                  <td className="p-2">
                    Rs {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex justify-between flex-wrap p-8 bg-[#181818]">
            <ul className="text-lg">
              <li>
                <span className="font-semibold mb-4">Items:</span> Rs {cart.itemsPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Shipping:</span> Rs {cart.shippingPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Tax:</span> Rs {cart.taxPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Total:</span> Rs {cart.totalPrice}
              </li>
            </ul>

            {error && (
              <Message variant="danger">
                {error?.data?.message || error.message}
              </Message>
            )}

            <div>
              <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </div>
          </div>

          <button
            type="button"
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;