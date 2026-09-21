import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Footer() {
  const containerRef = useRef(null);

  // Scroll tracking: Footer pichhle content ke upar smooth chadhega
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-120, 0]);

  const links = {
    Shop: ["An Ode to Cricket", "Active Lifestyle", "Cover Drive", "Hybrid Workout"],
    one8: ["About one8", "The one8 Promise"],
    "Customer Support": ["Contact Us", "Return & Exchange Portal", "FAQs"],
    Account: ["Log In"],
    Legal: [
      "Privacy Policy",
      "Terms of Use",
      "Warranty Policy",
      "Return, Exchanges and Refund Policy",
      "Cookie Policy",
    ],
  };

  return (
    <footer
      ref={containerRef}
      className="relative z-20 w-full overflow-hidden bg-[#121212] text-white pt-14"
    >
      <motion.div style={{ y }} className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Newsletter Section */}
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Join the one8 movement
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Get exclusive drops, training tips, and stories that fuel your next breakthrough - straight to your inbox.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col sm:flex-row items-baseline gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full max-w-xl border-b border-gray-700 bg-transparent py-2 text-lg sm:text-xl font-medium outline-none placeholder:text-gray-500 focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="rounded-full bg-[#00F0FF] px-8 py-3 text-sm font-bold text-black hover:opacity-90 transition-opacity"
            >
              Join the newsletter
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="border-t border-[#222] py-12 grid grid-cols-2 gap-8 md:grid-cols-6">
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white">Follow</h3>
            <p className="text-xs text-gray-400">Connect with us on our social channels</p>
            <div className="mt-1 flex items-center gap-2">
              {["f", "X", "in", "yt"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black hover:scale-110 transition-transform"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1f1f1f] py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <p>© one8 2026</p>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#0070d2] px-2 py-0.5 text-[10px] font-bold text-white">AMEX</span>
            <span className="rounded bg-[#00579f] px-2 py-0.5 text-[10px] font-bold text-white">VISA</span>
            <span className="rounded bg-[#eb001b] px-2 py-0.5 text-[10px] font-bold text-white">MC</span>
            <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-white">RuPay</span>
          </div>
        </div>

        {/* Large "one8" Watermark */}
        <div className="pointer-events-none select-none text-center leading-none">
          <span className="inline-block text-[25vw] font-black tracking-tighter text-[#1a1a1a]">
            one8
          </span>
        </div>
      </motion.div>
    </footer>
  );
}