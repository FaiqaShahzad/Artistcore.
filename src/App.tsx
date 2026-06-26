import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { CrochetView } from './components/CrochetView';
import { PaintingsView } from './components/PaintingsView';
import { CustomOrdersView } from './components/CustomOrdersView';
import { TestimonialsView } from './components/TestimonialsView';
import { BlogView } from './components/BlogView';
import { FaqView } from './components/FaqView';
import { ContactView } from './components/ContactView';
import { PrivacyView } from './components/PrivacyView';
import { TermsView } from './components/TermsView';
import { AdminView } from './components/AdminView';
import { CartDrawer, WishlistDrawer } from './components/Drawers';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { activeTab, contactInfo } = useApp();
  
  // Drawer Toggles
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Active View Router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'about':
        return <AboutView />;
      case 'crochet':
        return <CrochetView />;
      case 'paintings':
        return <PaintingsView />;
      case 'custom-orders':
        return <CustomOrdersView />;
      case 'testimonials':
        return <TestimonialsView />;
      case 'blog':
        return <BlogView />;
      case 'faq':
        return <FaqView />;
      case 'contact':
        return <ContactView />;
      case 'privacy':
        return <PrivacyView />;
      case 'terms':
        return <TermsView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsappNumber = contactInfo.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="relative min-h-screen bg-brand-white flex flex-col justify-between selection:bg-brand-gold selection:text-brand-black">
      
      {/* 1. Sticky Luxury Navigation Header */}
      <Header 
        onOpenCart={() => setCartOpen(true)} 
        onOpenWishlist={() => setWishlistOpen(true)} 
      />

      {/* 2. Main Visual Screen Stage with Page Animations */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Global Elegant Footer with Newsletter Submission Form */}
      <Footer />

      {/* 4. Sliding Shopping Bag & Wishlist Drawer Overlays */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />

      {/* 5. Persistent Floating Pakistan Studio Contact Utilities */}
      <div id="floating-actions-container" className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        
        {/* Scroll To Top Button */}
        <button
          onClick={handleScrollToTop}
          className="h-10 w-10 bg-brand-black/90 hover:bg-brand-black text-brand-white border border-brand-cream/30 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
          title="Scroll back to top"
        >
          <ArrowUp size={16} />
        </button>

        {/* Floating Call Hotline Button */}
        <a
          id="floating-call-button"
          href={`tel:${contactInfo.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 w-12 bg-brand-gold text-brand-black hover:bg-brand-white flex items-center justify-center rounded-full shadow-2xl border border-brand-gold transition-all duration-300 hover:scale-105"
          title="Call Direct Boutique Line"
        >
          <Phone size={20} />
        </a>

        {/* Floating WhatsApp Helper Button */}
        <a
          id="floating-whatsapp-button"
          href={`https://wa.me/${cleanWhatsappNumber}?text=Assalam-o-Alaikum%20Artistcore!%20I%20am%20exploring%20your%20luxury%20website%20and%20would%20like%20to%20consult%20with%20Faiqa%20regarding%20custom%20designs.%20JazakAllah!`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-14 w-14 bg-[#25D366] text-white flex items-center justify-center rounded-full shadow-2xl hover:bg-[#20ba59] transition-all duration-300 hover:scale-105"
          title="Chat with Faiqa on WhatsApp"
        >
          <MessageCircle size={24} className="fill-current text-white" />
        </a>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
