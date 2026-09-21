// import axios from "axios"
// import { useEffect, useState } from "react"
// import ProductCard from "./products-pages/ProductCard";

// const LIMIT = 12;
// const FeaturedSwiper = () => {

//     const [products, setProducts] = useState([]);

//     useEffect(() => {

//         const getProducts = async () => {
//             try {
//                 const params = new URLSearchParams();
//                 params.set("limit", LIMIT);
//                 const res = await axios.get(`http://localhost:3001/api/product/?${params}`)
//                 console.log(res.data);
//                 setProducts(res.data.data)

//             } catch (error) {
//                 console.error("🚀 ~ getProducts ~ error:", error)
//             }
//         }
//         getProducts()

//     }, [])

//     return (
//         <div>
//             <div className="grid grid-cols-3 gap-4">
//                 {products.length === 0 ? (
//                     <p>No products found</p>
//                 ) : (
//                     products.map((item) => (
//                         <ProductCard item={item} key={item.id} />
//                     ))
//                 )}
//             </div>
//         </div>
//     )
// }

// export default FeaturedSwiper

// import axios from "axios";
// import { useEffect, useState, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, FreeMode } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/free-mode";
// import ProductCard from "./products-pages/ProductCard";

// const LIMIT = 12;

// const FeaturedSwiper = () => {
//     const [products, setProducts] = useState([]);
//     const swiperRef = useRef(null);

//     useEffect(() => {
//         (async () => {
//             const res = await axios.get(
//                 `http://localhost:3001/api/product/?limit=${LIMIT}`
//             );
//             setProducts(res.data.data);
//         })().catch(console.error);
//     }, []);

//     if (!products.length) return <p className="text-center py-10">Loading...</p>;

//     return (
//         <div className="w-full py-6 px-2">
//             <h1 className="text-center text-2xl font-bold mb-2">Featured</h1>
//             <Swiper
//                 onSwiper={(s) => (swiperRef.current = s)}
//                 modules={[Navigation, FreeMode]}
//                 spaceBetween={16}
//                 slidesPerView={1.2}
//                 freeMode={{ enabled: true, momentum: true }}
//                 breakpoints={{
//                     480: { slidesPerView: 1.5 },
//                     640: { slidesPerView: 2.5 },
//                     1024: { slidesPerView: 305 },
//                     1280: { slidesPerView: 4.5 },
//                 }}>
//                 {products.map((item) => (
//                     <SwiperSlide key={item.id}>
//                         <ProductCard item={item} />
//                     </SwiperSlide>
//                 ))}
//             </Swiper>

//             {/* Simple arrows neeche */}
//             <div className="flex items-center justify-center gap-4 mt-6 px-1">
//                 <button onClick={() => swiperRef.current?.slidePrev()} className="text-xl">‹</button>
//                 <button onClick={() => swiperRef.current?.slideNext()} className="text-xl">›</button>
//             </div>
//         </div>
//     );
// };

// export default FeaturedSwiper;




import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Infinity as InfinityIcon } from "lucide-react"; // Lucide Icon

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import ProductCard from "./products-pages/ProductCard";

const LIMIT = 12;

const FeaturedSwiper = ({headingTitle}) => {
    const [products, setProducts] = useState([]);
    const [progress, setProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(1);
    const swiperRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/product/?limit=${LIMIT}`)
            .then((res) => setProducts(res.data.data))
            .catch(console.error);
    }, []);

    const handleSeek = (e) => {
        const bar = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const nextProgress = Math.max(0, Math.min(1, (clientX - bar.left) / bar.width));
        swiperRef.current?.setProgress(nextProgress, 200);
    };

    if (!products.length) return <p className="text-center py-10">Loading...</p>;

    return (
        <div className="w-full py-6 px-4 select-none">
            <h1 className="text-center text-2xl font-bold mb-4">{ headingTitle}</h1>

            <Swiper
                onSwiper={(s) => (swiperRef.current = s)}
                onProgress={(_, prog) => setProgress(prog)}
                onSlideChange={(s) => setActiveIndex(s.realIndex + 1)}
                modules={[Navigation, FreeMode]}
                spaceBetween={16}
                slidesPerView={1.2}
                freeMode={{ enabled: true, momentum: true }}
                breakpoints={{
                    480: { slidesPerView: 1.5 },
                    640: { slidesPerView: 2.5 },
                    1024: { slidesPerView: 3.5 },
                    1280: { slidesPerView: 4.5 },
                }}
            >
                {products.map((item) => (
                    <SwiperSlide key={item.id}>
                        <ProductCard item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Bottom Controls */}
            <div className="flex items-center gap-3 mt-6 max-w-md">
                <span className="text-xl text-neutral-600 min-w-8">
                    {activeIndex}/{products.length}
                </span>

                <button onClick={() => swiperRef.current?.slidePrev()} className="text-2xl px-1 cursor-pointer">‹</button>
                <button onClick={() => swiperRef.current?.slideNext()} className="text-2xl px-1 cursor-pointer">›</button>

                {/* Track with Lucide Icon Thumb */}
                <div
                    onPointerDown={handleSeek}
                    onPointerMove={(e) => e.buttons === 1 && handleSeek(e)}
                    className="relative flex-1 py-3 cursor-pointer touch-none"
                >
                    {/* Patli line (1.5px) */}
                    <div className="w-full h-2 bg-neutral-200">
                        <div 
                            className="h-full bg-black" 
                            style={{ width: `${progress * 100}%` }} 
                        />
                    </div>

                    {/* Lucide Icon Drag Button */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-black p-0.5 rounded-full border border-black shadow-xs cursor-grab active:cursor-grabbing flex items-center justify-center"
                        style={{ left: `${progress * 100}%` }}
                    >
                        <InfinityIcon size={14} strokeWidth={2.2} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedSwiper;