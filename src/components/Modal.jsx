import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Modal({ children, onClose, loading }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg max-w-md w-full relative mx-auto"
        onClick={(e) => e.stopPropagation()} // Prevent click events from propagating to the backdrop
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        >
          ✖
        </button>

        {loading ? (
          <div className="p-4">
            <Skeleton height={40} width={40} circle={true} />
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
}
