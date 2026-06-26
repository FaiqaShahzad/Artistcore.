import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, Heart, MessageCircle, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal, 
    contactInfo 
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [shippingAddress, setShippingAddress] = useState('');
  const [clientName, setClientName] = useState('');

  const handleLaunchWhatsAppCheckout = () => {
    if (!clientName || !shippingAddress) {
      alert('Please fill out your name and Lahore shipping coordinates.');
      return;
    }

    const itemsText = cart.map((ci, idx) => {
      const sizeText = ci.selectedSize ? ` (Size: ${ci.selectedSize})` : '';
      return `${idx + 1}. *${ci.item.name}*${sizeText} x ${ci.quantity} - PKR ${(ci.item.price * ci.quantity).toLocaleString()}`;
    }).join('%0D%0A');

    const totalText = `%0D%0A*Total Invoice:* PKR ${cartTotal.toLocaleString()}%0D%0A(50%25 Advance: PKR ${(cartTotal / 2).toLocaleString()})`;
    const clientText = `%0D%0A%0D%0A*Client Details:*%0D%0A- Name: ${clientName}%0D%0A- Address: ${shippingAddress}`;
    
    const message = `Assalam-o-Alaikum Artistcore! I am ready to finalize my premium cart checkout order via your Lahore boutique website:%0D%0A%0D%0A${itemsText}${totalText}${clientText}%0D%0A%0D%0APlease provide your active JazzCash / Easypaisa payment accounts. JazakAllah!`;
    const whatsappNum = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    
    window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');
  };

  const handleCloseReset = () => {
    setCheckoutStep('cart');
    setClientName('');
    setShippingAddress('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseReset}
            className="fixed inset-0 z-50 bg-brand-black/50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-brand-white p-6 shadow-2xl flex flex-col justify-between border-l border-brand-cream"
          >
            <div>
              <div className="flex items-center justify-between border-b border-brand-cream pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="text-brand-gold" size={18} />
                  <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider">
                    {checkoutStep === 'cart' ? 'Your Shopping Bag' : 'Boutique Checkout'}
                  </h3>
                </div>
                <button 
                  onClick={handleCloseReset}
                  className="p-1 text-brand-black hover:text-brand-gold transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step 1: Cart Listing */}
              {checkoutStep === 'cart' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-brand-gray space-y-3">
                      <span className="text-3xl block">🛍️</span>
                      <p className="font-serif italic text-sm">Your shopping bag is completely empty.</p>
                      <button 
                        onClick={handleCloseReset}
                        className="text-[10px] tracking-widest uppercase font-bold text-brand-gold hover:underline"
                      >
                        Explore Crochet Items →
                      </button>
                    </div>
                  ) : (
                    cart.map((ci) => (
                      <div key={ci.id} className="flex items-start justify-between gap-4 border-b border-brand-cream/40 pb-4">
                        <img 
                          src={ci.item.image} 
                          alt={ci.item.name} 
                          className="h-14 w-14 rounded-none object-cover border border-brand-cream"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow">
                          <h4 className="font-serif font-bold text-xs text-brand-black leading-tight line-clamp-1">{ci.item.name}</h4>
                          {ci.selectedSize && (
                            <span className="text-[9px] font-mono text-brand-gold font-bold block mt-0.5">Size: {ci.selectedSize}</span>
                          )}
                          <p className="font-mono text-xs text-brand-black font-bold mt-1">PKR {ci.item.price.toLocaleString()}</p>
                          
                          {/* Quantity selector */}
                          <div className="flex items-center border border-brand-cream rounded-none w-20 mt-2">
                            <button 
                              onClick={() => updateCartQuantity(ci.id, ci.quantity - 1)}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-brand-cream/20"
                            >
                              -
                            </button>
                            <span className="flex-grow text-center text-xs font-bold font-mono">{ci.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(ci.id, ci.quantity + 1)}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-brand-cream/20"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeFromCart(ci.id)}
                          className="p-1.5 text-brand-gray hover:text-rose-600 hover:bg-rose-50 rounded-none"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Step 2: Payment Details Form */}
              {checkoutStep === 'checkout' && (
                <div className="space-y-5">
                  <div className="bg-brand-cream/30 p-4 border border-brand-cream/60 rounded-none text-brand-gray text-xs space-y-2">
                    <div className="flex items-center gap-1 text-brand-gold font-bold uppercase text-[10px]">
                      <ShieldCheck size={12} /> Pakistan Payment Guide
                    </div>
                    <p className="leading-relaxed">
                      Custom artisanal orders are scheduled synchronously on <strong>50% advance deposit</strong> transfer. The remainder is cleared on local Lahore delivery.
                    </p>
                    <ul className="font-mono text-[10px] text-brand-black font-bold space-y-0.5">
                      <li>📱 Easypaisa / JazzCash: 0320-1195910</li>
                      <li>🏛️ Bank: Alfalah Gulberg Branch</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-1">Your Full Name *</label>
                      <input 
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Ayesha Khan"
                        className="w-full bg-[#FAF8F5] border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-1">Lahore Delivery Coordinates *</label>
                      <textarea 
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="House Number, Street details, Phase / Block, Lahore..."
                        rows={3}
                        className="w-full bg-[#FAF8F5] border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Total */}
            {cart.length > 0 && (
              <div className="border-t border-brand-cream pt-4 space-y-4 bg-brand-white">
                <div className="flex justify-between items-center text-sm font-semibold tracking-wide">
                  <span className="font-serif text-brand-gray uppercase text-xs">Invoice Total:</span>
                  <span className="font-mono text-brand-gold text-base font-bold">PKR {cartTotal.toLocaleString()}</span>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-white font-sans text-xs tracking-widest uppercase font-bold py-3.5 rounded-none shadow transition-all duration-300 text-center block"
                  >
                    Proceed to Payment Options
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      id="cart-whatsapp-checkout"
                      onClick={handleLaunchWhatsAppCheckout}
                      className="w-full bg-[#25D366] hover:bg-[#20ba59] text-brand-white font-sans text-xs tracking-widest uppercase font-bold py-3.5 rounded-none shadow flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={14} className="fill-current" />
                      Finalize Bag via WhatsApp
                    </button>
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="w-full text-center text-[10px] tracking-widest uppercase font-bold text-brand-gray hover:text-brand-black transition-colors py-1"
                    >
                      ← Return to Shopping Bag
                    </button>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


export const WishlistDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, setActiveTab } = useApp();

  const handleViewCollection = () => {
    setActiveTab('crochet');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-brand-black/50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-brand-white p-6 shadow-2xl flex flex-col justify-between border-l border-brand-cream"
          >
            <div>
              <div className="flex items-center justify-between border-b border-brand-cream pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Heart className="text-brand-gold fill-brand-gold" size={16} />
                  <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider">
                    Saved Masterpieces
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 text-brand-black hover:text-brand-gold transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {wishlist.length === 0 ? (
                  <div className="text-center py-20 text-brand-gray space-y-3">
                    <span className="text-3xl block">🌸</span>
                    <p className="font-serif italic text-sm">Your gallery wishlist is empty.</p>
                    <button 
                      onClick={handleViewCollection}
                      className="text-[10px] tracking-widest uppercase font-bold text-brand-gold hover:underline"
                    >
                      Browse Studio Pieces →
                    </button>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 border-b border-brand-cream/40 pb-4">
                      <img 
                        src={item.image} 
                        alt={item.name || (item as any).title} 
                        className="h-12 w-12 rounded-none object-cover border border-brand-cream"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow">
                        <h4 className="font-serif font-bold text-xs text-brand-black line-clamp-1 leading-tight">{item.name || (item as any).title}</h4>
                        <p className="font-mono text-[11px] text-brand-gold font-bold mt-1">PKR {item.price.toLocaleString()}</p>
                      </div>

                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="p-1.5 text-brand-gray hover:text-rose-600 hover:bg-rose-50 rounded-none"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {wishlist.length > 0 && (
              <div className="border-t border-brand-cream pt-4 bg-brand-white">
                <button
                  onClick={handleViewCollection}
                  className="w-full bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-white font-sans text-xs tracking-widest uppercase font-bold py-3.5 rounded-none text-center block transition-all"
                >
                  Configure & Order Saved Items
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
