import { motion } from "framer-motion";
import { Oval } from "react-loader-spinner";

export default function Modal({ children, onClose, loading }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        >
          ✖
        </button>

        {loading ? (
          <div className="flex justify-center items-center">
            <Oval
              height={40}
              width={40}
              color="#074221"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#0A5D2F"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
}
