import { AuthProvider } from "@/context/authProvider";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import '../styles/switch.css'; 
import InstallPWAButton from "@/components/InstallPWAButton";
import ServiceWorkerUpdater from "@/components/ServiceWorkerUpdater";


export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
      <InstallPWAButton />
      <ServiceWorkerUpdater />
    </AuthProvider>
  );
}
