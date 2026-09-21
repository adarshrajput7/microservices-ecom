// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ArrowRight, LucideTruck, MapPin, Phone } from "lucide-react";
// import { setOrderRedux } from "@/redux/orderSlice";
// import { Button } from "../ui/button";
// import { useCart } from "./CartContext";

// const Order = () => {
//   const { cartItems } = useCart();
//   const { user } = useSelector((store) => store.auth);
//   const { orderGet, refreshTrigger } = useSelector((store) => store.orderStore);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState(false);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async ({ orderId, user, onSuccess, onFailure }) => {
//     if (isProcessing) return;
//     setIsProcessing(true);

//     const isLoaded = await loadRazorpayScript();
//     if (!isLoaded) {
//       alert("Razorpay SDK load nahi ho paya!");
//       setIsProcessing(false);
//       return;
//     }

//     try {
//       const { data } = await axios.post(
//         `http://localhost:3004/api/payments/create/${orderId}`,
//         {},
//         { withCredentials: true }
//       );

//       if (!data?.success) {
//         alert("Payment order create fail ho gaya!");
//         setIsProcessing(false);
//         return;
//       }

//       const { order, razorpayKeyId } = data;

//       const options = {
//         key: razorpayKeyId,
//         amount: order.amount,
//         currency: order.currency,
//         name: "My Store",
//         description: `Payment for Order #${orderId}`,
//         order_id: order.id,

//         handler: async (response) => {
//           try {
//             const verifyRes = await axios.post(
//               "http://localhost:3004/api/payments/verify",
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderId,
//               },
//               { withCredentials: true }
//             );

//             if (verifyRes.data?.success) {
//               alert("Payment Verified & Success!");
//               onSuccess?.(verifyRes.data);
//             } else {
//               alert("Payment verification failed!");
//               onFailure?.(verifyRes.data);
//             }
//           } catch (error) {
//             console.error("Verification error:", error);
//             alert("Server verification me error aayi!");
//             onFailure?.(error);
//           } finally {
//             setIsProcessing(false);
//           }
//         },

//         prefill: {
//           name: `${user?.fullName?.firstName || ""} ${user?.fullName?.lastName || ""}`.trim(),
//           email: user?.email || "",
//           contact: user?.addresses?.[0]?.phone || "",
//         },

//         theme: { color: "#00FFFF" },

//         modal: {
//           ondismiss: () => setIsProcessing(false),
//         },
//       };

//       const razorpayInstance = new window.Razorpay(options);

//       razorpayInstance.on("payment.failed", (response) => {
//         alert(`Payment Fail: ${response.error.description}`);
//         setIsProcessing(false);
//         onFailure?.(response.error);
//       });

//       razorpayInstance.open();
//     } catch (error) {
//       console.error("Payment initiation error:", error);
//       alert(error.response?.data?.message || "Payment trigger nahi hua");
//       setIsProcessing(false);
//     }
//   };

//   const getOrder = async () => {
//     try {
//       const res = await axios.get("http://localhost:3003/api/order/me", { withCredentials: true });
//       if (res.data?.success) dispatch(setOrderRedux(res.data));
//     } catch (error) {
//       console.error("Fetch order error:", error);
//     }
//   };

//   useEffect(() => {
//     getOrder();
//   }, [refreshTrigger]);

//   const ordersList = orderGet?.orders || [];
//   const currentOrder = ordersList[0];
//   const shippingAddress = currentOrder?.shippingAddress;

//   const totalAmount = currentOrder?.totalPrice?.amount ?? cartItems.reduce(
//     (total, item) => total + (item.price?.amount || 0) * (item.qty || 1),
//     0
//   );

//   const totalItems = currentOrder?.items?.reduce(
//     (total, item) => total + (item.quantity || 0),
//     0
//   ) || cartItems.length;

//   return (
//     <div className="mt-20 flex w-full flex-col gap-8 px-4 pb-10 sm:px-6 lg:flex-row lg:px-20 xl:px-40">
//       <div className="w-full rounded-xl bg-gray-100 p-4 lg:w-1/2">
//         {ordersList.length > 0 ? (
//           ordersList.map((order) => (
//             <div key={order._id} className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//               <div className="flex items-center justify-between border-b pb-3">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Order ID: <span className="font-semibold text-gray-800">{order._id}</span></p>
//                   <p className="text-xs text-gray-400">Status: <span className="font-semibold text-yellow-600">{order.status || "PENDING"}</span></p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Total Price</p>
//                   <p className="text-sm font-bold text-gray-900">₹{order.totalPrice?.amount || 0}</p>
//                 </div>
//               </div>

//               <div className="divide-y divide-gray-100">
//                 {order.items?.map((item, idx) => (
//                   <div key={item._id || idx} className="flex items-center justify-between gap-4 py-3">
//                     <div className="flex min-w-0 items-center gap-3">
//                       <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
//                         <img src={item.images?.[0] || item.images?.[0] || "https://via.placeholder.com/150"} alt={item.title || "Product"} className="h-full w-full object-cover object-center" />
//                       </div>

//                       <div className="min-w-0">
//                         <h4 className="truncate text-sm font-semibold text-gray-800">{item.title || "Product"}</h4>
//                         <p className="text-xs text-gray-500">Size: <span className="font-medium text-gray-700">{item.size || "N/A"}</span></p>
//                         <p className="text-xs text-gray-500">Qty: <span className="font-medium text-gray-700">{item.quantity || 1}</span></p>
//                       </div>
//                     </div>

//                     <div className="shrink-0 text-right">
//                       <span className="text-sm font-bold text-gray-900">₹{item.price?.amount || 0}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="py-6 text-center text-gray-500">No orders found.</p>
//         )}
//       </div>

//       <div className="w-full lg:sticky lg:top-24 lg:h-fit lg:w-[30vw] xl:w-[25vw]">
//         <div className="flex flex-col gap-5">

//           {shippingAddress && (
//             <div className="rounded-xl border bg-white p-4 shadow-sm">
//               <p className="font-semibold text-gray-800">Deliver to:</p>

//               <div className="mt-3">
//                 <div className="flex items-center gap-2">
//                   <p className="font-semibold text-gray-800">{user?.fullName?.firstName} {user?.fullName?.lastName}</p>
//                   <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Shipping Address</span>
//                 </div>

//                 <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
//                   <MapPin size={20} className="shrink-0 rounded-sm bg-[#00FFFF] p-1 text-black" />
//                   {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}, {shippingAddress.country}
//                 </p>

//                 <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
//                   <Phone size={20} className="shrink-0 rounded-sm bg-[#00FFFF] p-1 text-black" />
//                   {shippingAddress.phone}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <h2 className="mb-4 text-lg font-bold">Payment Details</h2>

//             <div className="flex justify-between text-sm text-gray-600">
//               <p>Total Items ({totalItems})</p>
//               <p>₹{Number(totalAmount).toLocaleString()}</p>
//             </div>

//             <div className="mt-3 flex justify-between text-sm text-gray-600">
//               <p>Delivery</p>
//               <p className="text-green-600">FREE</p>
//             </div>

//             <div className="mt-4 flex justify-between border-t pt-4">
//               <p className="font-bold">Total Amount</p>
//               <p className="font-bold">₹{Number(totalAmount).toLocaleString()}</p>
//             </div>

//             <button
//               onClick={() => {
//                 if (!currentOrder) {
//                   alert("Koi active order nahi mila!");
//                   return;
//                 }

//                 handlePayment({
//                   orderId: currentOrder._id,
//                   user,
//                   onSuccess: () => navigate("/orders"),
//                   onFailure: (error) => console.error("Payment failed", error),
//                 });
//               }}
//               disabled={isProcessing || !currentOrder}
//               className="mt-5 w-full rounded-md bg-[#00FFFF] py-3 font-bold text-gray-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {isProcessing ? "Processing..." : "Checkout securely"}
//             </button>
//           </div>
//         </div>

//         <Button onClick={() => navigate("/cart")} className="mt-5 w-full bg-gray-900 text-gray-50 hover:bg-gray-800 lg:mt-10">
//           View My Orders <LucideTruck /> <ArrowRight />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Order;


import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, CheckCircle, CheckCircle2, LucideTruck, MapPin, Phone } from "lucide-react";
import { setOrderRedux } from "@/redux/orderSlice";
import { Button } from "../ui/button";

const Order = () => {
  const { user } = useSelector((store) => store.auth);
  const { orderGet, refreshTrigger } = useSelector((store) => store.orderStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const ordersList = orderGet?.orders || [];

  // Active selected order object
  const activeOrder = useMemo(() => {
    return ordersList.find((o) => o._id === selectedOrderId) || ordersList[0];
  }, [ordersList, selectedOrderId]);

  // Check karein item paid hai ya nahi
  const checkIsItemPaid = (item) => {
    return (
      item?.paymentStatus === "PAID" ||
      item?.isPaid === true ||
      activeOrder?.paymentStatus === "PAID"
    );
  };

  // Jab pehli baar orders load hon to pehla order select karein
  useEffect(() => {
    if (ordersList.length > 0 && !selectedOrderId) {
      setSelectedOrderId(ordersList[0]._id);
    }
  }, [ordersList, selectedOrderId]);

  // Order change hone par sirf UNPAID items ko default check karein
  useEffect(() => {
    if (activeOrder?.items?.length) {
      const unpaidItemIds = activeOrder.items
        .filter((item) => !checkIsItemPaid(item))
        .map((item) => item._id);

      setSelectedItemIds(unpaidItemIds);
    } else {
      setSelectedItemIds([]);
    }
  }, [activeOrder]);

  const handleSelectOrder = (order) => {
    setSelectedOrderId(order._id);
  };

  const toggleItemSelection = (item, itemId) => {
    if (checkIsItemPaid(item)) return;

    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Active Order ke sirf checked aur UNPAID items ka subtotal count karein
  const { calculatedAmount, selectedCount } = useMemo(() => {
    if (!activeOrder?.items) return { calculatedAmount: 0, selectedCount: 0 };

    return activeOrder.items.reduce(
      (acc, item) => {
        const isPaid = checkIsItemPaid(item);

        if (!isPaid && selectedItemIds.includes(item._id)) {
          const qty = item.quantity || 1;
          const price = item.price?.amount || 0;
          acc.calculatedAmount += price * qty;
          acc.selectedCount += qty;
        }
        return acc;
      },
      { calculatedAmount: 0, selectedCount: 0 }
    );
  }, [activeOrder, selectedItemIds]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getOrder = async () => {
    try {
      const res = await axios.get("http://localhost:3003/api/order/me", {
        withCredentials: true,
      });
      if (res.data?.success) dispatch(setOrderRedux(res.data));
    } catch (error) {
      console.error("Fetch order error:", error);
    }
  };

  useEffect(() => {
    getOrder();
  }, [refreshTrigger]);

  const handlePayment = async () => {
    if (!activeOrder) {
      alert("Kripya pehle ek order chunein!");
      return;
    }

    if (selectedItemIds.length === 0) {
      alert("Payment ke liye kam se kam ek unpaid item select karein!");
      return;
    }

    setIsProcessing(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK load hone me samasya aayi!");
      setIsProcessing(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:3004/api/payments/create/${activeOrder._id}`,
        {
          selectedItemIds,
          customAmount: calculatedAmount,
        },
        { withCredentials: true }
      );

      if (!data?.success) {
        alert("Payment order create fail ho gaya!");
        setIsProcessing(false);
        return;
      }

      const { order, razorpayKeyId } = data;

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "My Store",
        description: `Payment for Order #${activeOrder._id}`,
        order_id: order.id,

        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              "http://localhost:3004/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyRes.data?.success) {
              alert("Payment Verified! Selected items ab Paid ho chuke hain.");
              await getOrder(); // Fresh data fetch karega jisme isPaid: true hoga
              navigate("/orders");
            } else {
              alert("Payment verification fail ho gaya!");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verify karne me server error aaya!");
          } finally {
            setIsProcessing(false);
          }
        },

        prefill: {
          name: `${user?.fullName?.firstName || ""} ${user?.fullName?.lastName || ""}`.trim(),
          email: user?.email || "",
          contact: user?.addresses?.[0]?.phone || "",
        },

        theme: { color: "#00FFFF" },

        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", (response) => {
        alert(`Payment Fail: ${response.error.description}`);
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert(error.response?.data?.message || "Payment trigger nahi hua");
      setIsProcessing(false);
    }
  };

  const shippingAddress = activeOrder?.shippingAddress;
  const isEntireOrderPaid = activeOrder?.items?.every((item) => checkIsItemPaid(item));

  return (
    <div className="mt-20 flex w-full flex-col gap-8 px-4 pb-10 sm:px-6 lg:flex-row lg:px-20 xl:px-40">
      {/* Left Column: Orders List */}
      <div className="w-full space-y-4 rounded-xl bg-gray-100 p-4 lg:w-1/2">
        <h3 className="text-base font-semibold text-gray-700">Aapke Orders:</h3>
        {ordersList.length > 0 ? (
          ordersList.map((order) => {
            const isOrderActive = order._id === activeOrder?._id;

            return (
              <div
                key={order._id}
                onClick={() => handleSelectOrder(order)}
                className={`cursor-pointer space-y-4 rounded-xl border-2 bg-white p-4 shadow-sm transition ${
                  isOrderActive
                    ? "border-cyan-500 ring-2 ring-cyan-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isOrderActive
                          ? "bg-cyan-500 border-cyan-500 text-white"
                          : "border-gray-400"
                      }`}
                    >
                      {isOrderActive && <span className="block h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Order ID: <span className="font-semibold text-gray-800">{order._id}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Status: <span className="font-semibold text-yellow-600">{order.status || "PENDING"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Order Amount</p>
                    <p className="text-sm font-bold text-gray-900">₹{order.totalPrice?.amount || 0}</p>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items?.map((item) => {
                    const itemId = item._id;
                    const isPaid = checkIsItemPaid(item);
                    const isChecked = isOrderActive && selectedItemIds.includes(itemId);

                    return (
                      <div
                        key={itemId}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOrderActive) handleSelectOrder(order);
                          toggleItemSelection(item, itemId);
                        }}
                        className={`flex items-center justify-between gap-4 py-3 rounded-lg px-2 transition ${
                          isPaid ? "bg-emerald-50/60 cursor-default" : "hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {isPaid ? (
                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Done
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                            />
                          )}

                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                            <img
                              src={item.images?.[0] || "https://via.placeholder.com/150"}
                              alt={item.title || "Product"}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold text-gray-800">{item.title || "Product"}</h4>
                            <p className="text-xs text-gray-500">Size: <span className="font-medium text-gray-700">{item.size || "N/A"}</span></p>
                            <p className="text-xs text-gray-500">Qty: <span className="font-medium text-gray-700">{item.quantity || 1}</span></p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{(item.price?.amount || 0) * (item.quantity || 1)}
                          </span>
                          {isPaid && <p className="text-[11px] font-semibold text-emerald-600">Paid</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-6 text-center text-gray-500">No orders found.</p>
        )}
      </div>

      {/* Right Column: Address & Payment Summary */}
      <div className="w-full lg:sticky lg:top-24 lg:h-fit lg:w-[30vw] xl:w-[25vw]">
        <div className="flex flex-col gap-5">
          {shippingAddress && (
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="font-semibold text-gray-800">Deliver to:</p>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">{user?.fullName?.firstName} {user?.fullName?.lastName}</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Shipping Address</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={20} className="shrink-0 rounded-sm bg-[#00FFFF] p-1 text-black" />
                  {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}, {shippingAddress.country}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <Phone size={20} className="shrink-0 rounded-sm bg-[#00FFFF] p-1 text-black" />
                  {shippingAddress.phone}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Payment Details</h2>

            <div className="flex justify-between text-sm text-gray-600">
              <p>Selected Unpaid Items ({selectedCount})</p>
              <p>₹{calculatedAmount.toLocaleString()}</p>
            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <p>Delivery</p>
              <p className="text-green-600 font-medium">FREE</p>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4">
              <p className="font-bold">Payable Amount</p>
              <p className="font-bold text-cyan-600 text-lg">₹{calculatedAmount.toLocaleString()}</p>
            </div>

            {isEntireOrderPaid ? (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-md bg-emerald-100 py-3 font-semibold text-emerald-800">
                <CheckCircle2 size={18} /> Is Order Ke Sabhi Items Paid Hain
              </div>
            ) : (
              <button
                onClick={handlePayment}
                disabled={isProcessing || !activeOrder || selectedItemIds.length === 0}
                className="mt-5 w-full rounded-md bg-[#00FFFF] py-3 font-bold text-gray-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing
                  ? "Processing..."
                  : selectedItemIds.length === 0
                  ? "Select at least 1 unpaid item"
                  : `Pay ₹${calculatedAmount.toLocaleString()}`}
              </button>
            )}
          </div>
        </div>

        <Button onClick={() => navigate("/cart")} className="mt-5 w-full bg-gray-900 text-gray-50 hover:bg-gray-800 lg:mt-10">
          Back to Cart <LucideTruck className="ml-2" /> <ArrowRight className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Order;