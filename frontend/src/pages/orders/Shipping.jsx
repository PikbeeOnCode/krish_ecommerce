import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("eSewa");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto mt-10">
      <ProgressSteps step1 step2 />
      <div className="mt-[10rem] flex justify-around items-center flex-wrap">
        <form onSubmit={submitHandler} className="w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
          <div className="mb-4">
            <label className="block text-white mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Postal Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Country</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Select Payment Method</label>

            {/* eSewa option */}
            <div
              onClick={() => setPaymentMethod("eSewa")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 border-2 ${
                paymentMethod === "eSewa" ? "border-[#60BB46]" : "border-gray-600"
              }`}
            >
              <div className="bg-[#60BB46] rounded-full w-7 h-7 flex items-center justify-center">
                <span className="text-white font-bold text-sm">e</span>
              </div>
              <span className="text-white font-semibold">eSewa</span>
              {paymentMethod === "eSewa" && (
                <span className="ml-auto text-[#60BB46] text-sm">✓ Selected</span>
              )}
            </div>

            {/* Cash on Delivery option */}
            <div
              onClick={() => setPaymentMethod("Cash on Delivery")}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 ${
                paymentMethod === "Cash on Delivery" ? "border-pink-500" : "border-gray-600"
              }`}
            >
              <span className="text-2xl">💵</span>
              <span className="text-white font-semibold">Cash on Delivery</span>
              {paymentMethod === "Cash on Delivery" && (
                <span className="ml-auto text-pink-500 text-sm">✓ Selected</span>
              )}
            </div>
          </div>

          <button
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;