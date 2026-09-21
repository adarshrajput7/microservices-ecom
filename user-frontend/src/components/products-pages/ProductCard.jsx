import { Heart, X } from "lucide-react";
import { useState } from "react";
import { IoBagAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setTriggerRefresh } from "@/redux/orderSlice";
import { useDispatch } from "react-redux";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const [openBag, setOpenBag] = useState(false)
  const [selectedSize, setSelectedSize] = useState();

  const image = item.images?.[4]?.thumbnail || item.images?.[0]?.url;
  const price = item.price?.amount || item.price;
  const dispatch = useDispatch()

  const goToProduct = () => navigate(`/view/${item._id}`);

  const handleWishlist = (e) => {
    e.stopPropagation();
    // wishlist logic
    toast.error("This Featured under process")
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();
    // add to bag logic
    setOpenBag(true)
  };

  const addToCart = async (id) => {
    if (!selectedSize) {
      toast.error("Please select the size")
      return;
    }
    try {

      const res = await axios.post(`http://localhost:3002/api/cart/items`, {
        "productId": id,
        "qty": 1,
        "size": selectedSize
      }, {
        headers: {
          "Content-Type": "application/json"
        }, withCredentials: true
      })

      if (res.data.success) {
        dispatch(setTriggerRefresh())
        toast.success('Add To Catt')
        navigate('/cart')
      }
      console.log(res);


    } catch (error) {
      console.error("🚀 ~ addToCart ~ error:", error)
    }
  }

  return (
    <>
      {/* Product Card */}
      <div
        onClick={goToProduct}
        className="group relative cursor-pointer overflow-hidden rounded-lg bg-[#e5e5e5]
 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        {/* Product Image */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-[#f5f5f5]">
          <img
            src={image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={handleWishlist}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full  text-gray-900  transition-all duration-200 hover:text-red-500 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
          >
            <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Product Details */}
        <div className="px-2.5 pb-3 pt-2.5 sm:px-3 sm:pb-4 sm:pt-3">
          <p className="mb-0.5 truncate text-[9px] font-bold uppercase tracking-wider text-gray-900 sm:text-[10px]">
            {item.category || "Women's Lifestyle"}
          </p>

          <h2 className="line-clamp-1 text-xs font-normal text-gray-800 sm:text-sm">
            {item.title}
          </h2>

          <div className="mt-1.5 flex items-center justify-between gap-2 sm:mt-2">
            <p className="truncate text-sm font-bold text-gray-900 sm:text-base">
              ₹ {Number(price).toLocaleString("en-IN")}.00
            </p>

            {/* Add to Bag */}
            <button
              type="button"
              aria-label="Add to bag"
              onClick={handleAddToBag}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:bg-gray-900 hover:text-white sm:h-9 sm:w-9"
            >
              <IoBagAddOutline className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
            </button>
          </div>
        </div>
      </div>


      {/* bag */}
      {/* <div className={`bg-indigo-100 lg:w-[50vw] lg:h-[30vw] w-[90vw] h-[50vh] fixed inset-0 m-auto z-50 transition-all duration-300 ease-out ${openBag ? "opacity-100 scale-100 pointer-events-auto"
        : "opacity-0 scale-95 pointer-events-none"}`} >
        <Button onClick={() => setOpenBag(false)} variant="none" className="absolute right-2 top-2">
          <X className="size-6 border-2 border-black rounded-full" />
        </Button>

        <div className="w-full h-fit overflow-hidden flex ">
          <div className="w-1/2 px-2 flex justify-center items-center lg:block hidden ">
            <img src="https://i.pinimg.com/736x/48/22/db/4822db571c444011615e286d49c15325.jpg" alt="" className="aspect-4/5 object-cover w-full p-5" />
          </div>

          <div className="pt-2 w-1/2 px-5 flex flex-col justify-around">
            <p className="border-b-2 border-[#00FFFF] inline-block">See full product details</p>
            <h1>Seam XVIII OG</h1>
            <p>₹ 6,999.00</p>
            <button className="bg-[#00FFFF] py-2 w-full rounded-full text-black font-bold bottom-0">Add To Bag</button>
          </div>
        </div>

      </div> */}

      {createPortal(
        <div className={`fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/40 transition-all duration-300 ease-out ${openBag ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          {/* Modal Box */}
          <div className={`relative w-full max-w-85 md:max-w-2xl bg-[#EBECEE] md:bg-white shadow-xl flex flex-col md:flex-row overflow-hidden transition-transform duration-300 ${openBag ? "scale-100" : "scale-95"}`}>
            {/* Close Button */}
            <Button onClick={() => setOpenBag(false)} variant="none" className="absolute right-3 top-3 z-10 p-0 text-black hover:opacity-70">
              <X className="size-6 p-0.5 border-2 border-black rounded-full" />
            </Button>

            {/* Left: Product Image (PC Only) */}
            <div className="hidden md:flex w-1/2 bg-[#F3F4F6] items-center justify-center p-2">
              <img src={image} alt="Product" className="w-full aspect-square object-contain" />
            </div>

            {/* Right: Details & Options */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-around gap-3.5 text-black">
              <div>
                <a onClick={goToProduct} href="#" className="text-xs font-medium border-b-2 border-[#00FFFF] pb-0.5 inline-block">
                  See full product details
                </a>
                <h2 className="text-xl md:text-2xl font-black mt-2 tracking-tight">{item?.title}</h2>
                <p className="text-sm font-semibold mt-1">₹ {Number(price).toLocaleString("en-IN")}.00</p>
              </div>

              {/* Size Radio Group */}
              <div className="text-xs">
                <p className="font-semibold mb-1.5">Size:</p>
                <div className="flex flex-wrap gap-1.5 font-medium">
                  {(item?.category?.toUpperCase() === "FOOTWEAR"
                    ? ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]
                    : ["CLOTHING", "ACTIVE_LIFESTYLE"].includes(item?.category?.toUpperCase())
                      ? ["S", "M", "L"]
                      : []).map((sz) => (
                        <label key={sz} className="cursor-pointer">
                          <input type="radio" name="size" value={sz} checked={selectedSize === sz} onChange={(e) => setSelectedSize(e.target.value)} className="sr-only" />
                          <span className={`w-10 h-7 flex items-center justify-center transition ${selectedSize === sz
                            ? "bg-black text-white" : "bg-white/70 text-gray-800"}`}>{sz}
                          </span>
                        </label>
                      ))}
                </div>
              </div>

              {/* CTA Button */}
              <button onClick={() => addToCart(item._id)} className="w-full mt-2 py-2.5 bg-[#00FFFF] hover:bg-[#00e6e6] text-black font-bold rounded-full text-sm transition">Add to Bag</button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </>
  );
};

export default ProductCard;