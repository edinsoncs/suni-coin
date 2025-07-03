import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { ThemeProvider } from '../components/ThemeContext';
import { WalletProvider } from '../components/WalletContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletProvider>
    </ThemeProvider>
  );
}
