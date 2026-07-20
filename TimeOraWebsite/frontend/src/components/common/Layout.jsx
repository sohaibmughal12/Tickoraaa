import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0b0b]">
      {/* Toast notifications container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1F1F1F',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#1F1F1F',
            },
          },
        }}
      />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Layout Wrapper */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
