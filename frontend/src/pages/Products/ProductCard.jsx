import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import moment from "moment";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="w-[18rem] relative bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02] transition-all duration-300">

      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            className="cursor-pointer w-full"
            src={p.coverImage}
            alt={p.title}
            style={{ height: "220px", objectFit: "cover" }}
          />
        </Link>
        <div className="absolute top-3 right-3">
          <HeartIcon product={p} />
        </div>
      </section>

      <div className="p-4">

        <Link to={`/product/${p._id}`}>
          <h5 className="text-white font-semibold text-lg mb-1 hover:text-pink-400 transition-colors line-clamp-1">
            {p?.title}
          </h5>
        </Link>

        <p className="text-gray-400 text-sm mb-3">
          {moment(p?.publishedDate).format("MMM DD, YYYY")}
        </p>

        <div className="flex justify-between items-center">
          <p className="font-bold text-pink-500 text-xl">
            Rs{p?.price}
          </p>

          <button
            className="p-2 rounded-full bg-[#2A2A2A] hover:bg-pink-600 transition-colors"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={22} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;