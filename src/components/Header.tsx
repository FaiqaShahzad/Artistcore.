import React, { useState } from 'react';
import { useApp, ActiveTabType } from '../context/AppContext';
import { Menu, X, ShoppingBag, Heart, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenWishlist }) => {
  const { activeTab, setActiveTab, cartCount, wishlist } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; tab: ActiveTabType }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'About', tab: 'about' },
    { label: 'Crochet', tab: 'crochet' },
    { label: 'Paintings', tab: 'paintings' },
    { label: 'Custom Orders', tab: 'custom-orders' },
    { label: 'Journal', tab: 'blog' },
    { label: 'FAQ', tab: 'faq' },
    { label: 'Contact', tab: 'contact' },
  ];

  const handleNavClick = (tab: ActiveTabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header id="header-container" className="sticky top-0 z-40 w-full border-b border-brand-cream/40 bg-brand-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo - Cormorant Garamond Serif */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')} 
            className="group flex cursor-pointer flex-col items-start"
          >
            <span className="font-serif text-2xl font-bold tracking-[0.15em] text-brand-black transition-colors duration-300 group-hover:text-brand-gold">
              ARTISTCORE
            </span>
            <span className="text-[9px] font-medium tracking-[0.35em] text-brand-gold uppercase">
              Lahore
            </span>
          </div>

          {/* Desktop Navigation - Elegant Spacing */}
          <nav id="desktop-nav" className="hidden lg:flex lg:items-center lg:space-x-8">
            {navItems.map((item) => (
              <button
                id={`nav-item-${item.tab}`}
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`relative font-sans text-xs tracking-[0.15em] uppercase transition-colors duration-300 py-2 ${
                  activeTab === item.tab
                    ? 'font-semibold text-brand-gold'
                    : 'text-brand-black/70 hover:text-brand-gold'
                }`}
              >
                {item.label}
                {activeTab === item.tab && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 h-[1.5px] w-full bg-brand-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Buttons: Wishlist, Cart, Admin Panel, Mobile Menu Toggle */}
          <div id="header-actions" className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Admin Dashboard Trigger */}
            <button
              id="admin-nav-button"
              onClick={() => handleNavClick('admin')}
              className={`flex items-center space-x-1 border border-dashed rounded-none px-3 py-1.5 text-[10px] tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'border-brand-gold bg-brand-gold/10 text-brand-gold font-bold'
                  : 'border-brand-gray/30 text-brand-black/60 hover:border-brand-gold hover:text-brand-gold'
              }`}
              title="Aesthetic CMS Admin Panel"
            >
              <ShieldAlert size={12} />
              <span className="hidden sm:inline">CMS Panel</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-trigger"
              onClick={onOpenWishlist}
              className="group relative p-2 text-brand-black/80 hover:text-brand-gold transition-colors duration-300"
              aria-label="View Wishlist"
            >
              <Heart 
                size={20} 
                className={wishlist.length > 0 ? 'fill-brand-gold text-brand-gold' : 'transition-transform duration-300 group-hover:scale-110'} 
              />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-brand-gold" />
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              id="cart-trigger"
              onClick={onOpenCart}
              className="group relative p-2 text-brand-black/80 hover:text-brand-gold transition-colors duration-300"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag size={20} className="transition-transform duration-300 group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-black text-[9px] font-bold text-brand-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-black lg:hidden"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-brand-black/50 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              id="mobile-menu-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-brand-white p-6 shadow-2xl flex flex-col justify-between lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between border-b border-brand-cream pb-4 mb-8">
                  <div className="flex flex-col">
                    <span className="font-serif text-xl font-bold tracking-[0.15em] text-brand-black">ARTISTCORE</span>
                    <span className="text-[8px] font-semibold tracking-[0.3em] text-brand-gold uppercase">Lahore</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="p-1 text-brand-black hover:text-brand-gold"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col space-y-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      id={`mobile-nav-item-${item.tab}`}
                      key={item.tab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNavClick(item.tab)}
                      className={`text-left font-sans text-sm tracking-[0.2em] uppercase py-3 border-b border-brand-cream/30 ${
                        activeTab === item.tab
                          ? 'font-bold text-brand-gold'
                          : 'text-brand-black/70 hover:text-brand-gold'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                  
                  {/* Admin trigger in mobile nav */}
                  <motion.button
                    id="mobile-nav-admin"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    onClick={() => handleNavClick('admin')}
                    className={`text-left font-sans text-sm tracking-[0.2em] uppercase py-3 text-brand-gold font-bold border-b border-brand-cream/30`}
                  >
                    🔒 Dynamic CMS Admin
                  </motion.button>
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="border-t border-brand-cream pt-6">
                <p className="font-serif text-sm italic text-brand-black">Handcrafted Art. Timeless Creativity.</p>
                <p className="mt-2 text-[10px] tracking-wider text-brand-gray">Lahore, Pakistan</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
