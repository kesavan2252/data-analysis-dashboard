// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/**
 * Full-screen overlay loader with fade-in animation.
 * Props:
 *  - message: optional text shown beneath the spinner.
 */
const Loader = ({ message = "Analyzing your file... pls wait" }) => (
  <motion.div
    className="fixed inset-0 backdrop-blur-sm bg-white/60 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex flex-col items-center space-y-4">
      {/* Spinner */}
      <div
        role="status"
        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
      />
      {/* Message */}
      <p className="text-blue-700 font-medium text-center animate-pulse">
        {message}
      </p>
    </div>
  </motion.div>
);

export default Loader;
