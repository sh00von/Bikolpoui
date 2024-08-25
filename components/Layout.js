// components/Layout.js
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { Analytics } from "@vercel/analytics/react";
const Layout = ({ children, title = 'Default Title', description = 'Default description', ogImage = '/path/to/default-image.jpg' }) => {
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph Meta Tags for Facebook */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/bikolpo.png" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <main className="flex-grow">{children}</main>
      
      <Analytics />
      <Footer />
    </div>
  );
};

export default Layout;
