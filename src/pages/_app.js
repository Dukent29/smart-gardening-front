import "@/styles/globals.css";
import { AuthProvider } from "@/context/authProvider";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
