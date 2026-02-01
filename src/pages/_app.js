import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}
