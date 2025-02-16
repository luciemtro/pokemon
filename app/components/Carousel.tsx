"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-screen h-[800px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {/* Image */}
          <img
            src={images[index]}
            alt={`Slide ${index}`}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Overlay Radial Gradient */}
          <div className="absolute inset-0 bg-radial-gradient-pokemon pointer-events-none"></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Carousel;
