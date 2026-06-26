import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Painting } from '../types';
import { Eye, Heart, MessageCircle, X, ShieldCheck, Sparkles, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PaintingsView: React.FC = () => {
  const { paintings, toggleWishlist, isInWishlist, contactInfo } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Portraits' | 'Canvas Art' | 'Custom Paintings'>('All');
  
  // Lightbox State
  const [activePainting, setActivePainting] = useState<Painting | null>(null);

  const categories: ('All' | 'Portraits' | 'Canvas Art' | 'Custom Paintings')[] = [
    'All', 'Portraits', 'Canvas Art', 'Custom Paintings'
  ];

  const filteredPaintings = paintings.filter(paint => {
    return selectedCategory === 'All' || paint.category === selectedCategory;
  });

  const handleWhatsAppInquiry = (painting: Painting) => {
    const text = `Assalam-o-Alaikum Artistcore! I am fascinated by your fine art masterpiece:%0D%0A%0D%0A*${painting.title}*%0D%0APrice: PKR ${painting.price.toLocaleString()}%0D%0AMedium: ${painting.medium}%0D%0ASize: ${painting.size}%0D%0A%0D%0APlease let me know if this piece is currently available or if you can paint a custom commission with similar strokes. JazakAllah!`;
    const whatsappNumber = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div id="paintings-gallery-view" className="bg-brand-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold">Luminous Glazes</span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-brand-black leading-tight">
            Fine Art Paintings Gallery
          </h1>
          <p className="mt-3 font-sans text-xs sm:text-sm text-brand-gray tracking-wide leading-relaxed">
            Exquisite portraits and heavy-texture contemporary canvas creations. Hand-painted in Lahore using premier oil pigments and gold leaf detailing on fine stretched linen.
          </p>
        </div>

        {/* Categories Navbar */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-brand-cream/60 pb-6 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-[10px] tracking-widest uppercase font-bold transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-brand-black border-brand-black text-brand-white shadow-lg'
                  : 'bg-brand-white hover:bg-brand-cream/30 border-brand-cream/80 text-brand-black/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Artwork Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filteredPaintings.map((painting) => (
            <div
              id={`painting-card-${painting.id}`}
              key={painting.id}
              onClick={() => setActivePainting(painting)}
              className="group cursor-pointer flex flex-col bg-brand-white border border-brand-cream/50 rounded-none overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Image with subtle overlay on hover */}
              <div className="aspect-[4/5] relative overflow-hidden bg-brand-cream/10 border-b border-brand-cream/30">
                <img
                  src={painting.image}
                  alt={painting.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual hover controls */}
                <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePainting(painting);
                    }}
                    className="h-10 w-10 flex items-center justify-center bg-brand-white hover:bg-brand-gold text-brand-black rounded-none transition-colors shadow"
                    title="Enlarge Lightbox"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(painting);
                    }}
                    className="h-10 w-10 flex items-center justify-center bg-brand-white hover:bg-brand-gold text-brand-black rounded-none transition-colors shadow"
                    title="Wishlist Masterpiece"
                  >
                    <Heart size={16} className={isInWishlist(painting.id) ? 'fill-brand-gold text-brand-gold' : ''} />
                  </button>
                </div>

                {/* Categories Badge */}
                <div className="absolute top-4 left-4 bg-brand-black/90 text-brand-white text-[8px] font-bold tracking-widest uppercase px-3 py-1 rounded-none shadow">
                  {painting.category}
                </div>
              </div>

              {/* Title & Dimension Info */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg tracking-wide text-brand-black font-semibold group-hover:text-brand-gold transition-colors duration-300">
                    {painting.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-brand-gold font-bold">
                    PKR {painting.price.toLocaleString()}
                  </p>
                  <p className="mt-3.5 font-sans text-xs text-brand-gray tracking-wide line-clamp-2 leading-relaxed">
                    {painting.description}
                  </p>
                </div>
                
                <div className="mt-6 border-t border-brand-cream/40 pt-4 flex items-center justify-between text-[10px] text-brand-black/60 font-mono">
                  <span>📐 {painting.size}</span>
                  <span className="italic">Oil/Acrylic</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Elegant Fine Art Lightbox Modal */}
      <AnimatePresence>
        {activePainting && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePainting(null)}
              className="fixed inset-0 z-50 bg-brand-black/90 backdrop-blur-md"
            />

            {/* Lightbox Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-brand-black text-brand-white z-50 shadow-2xl rounded-none overflow-y-auto border border-brand-cream/20"
            >
              <div className="relative p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Close Button */}
                <button
                  onClick={() => setActivePainting(null)}
                  className="absolute top-4 right-4 p-2 bg-brand-white/10 hover:bg-brand-gold rounded-none text-brand-white z-10 transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Left Side Large Master Image */}
                <div className="flex flex-col justify-center items-center bg-[#1F1F1F] rounded-none border border-brand-cream/10 p-2 shadow-inner aspect-[4/5]">
                  <img
                    src={activePainting.image}
                    alt={activePainting.title}
                    className="max-h-[500px] max-w-full object-contain shadow-2xl border border-brand-black"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Right Side Editorial Inquiries Details */}
                <div className="flex flex-col justify-between py-2">
                  <div className="space-y-6">
                    <div>
                      <span className="flex items-center gap-1.5 text-brand-gold text-[10px] tracking-widest uppercase font-bold">
                        <Sparkles size={12} /> {activePainting.category}
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl text-brand-white tracking-wide font-light mt-3">
                        {activePainting.title}
                      </h2>
                      <p className="font-mono text-xl text-brand-gold font-bold mt-1.5">
                        PKR {activePainting.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="h-[1.5px] w-12 bg-brand-gold" />

                    <p className="font-sans text-xs sm:text-sm text-brand-white/80 leading-relaxed tracking-wide font-light">
                      {activePainting.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-brand-cream/10 pt-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-brand-gold tracking-wider uppercase flex items-center gap-1">
                          <Scale size={10} /> Dimensions
                        </span>
                        <p className="text-xs font-mono font-bold text-brand-white/90">{activePainting.size}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-brand-gold tracking-wider uppercase flex items-center gap-1">
                          🎨 Medium Study
                        </span>
                        <p className="text-xs font-sans text-brand-white/90 leading-relaxed">{activePainting.medium}</p>
                      </div>
                    </div>

                    <div className="border border-brand-cream/20 bg-[#171717] p-4 rounded-none text-brand-white/70 space-y-2">
                      <div className="flex items-center gap-1.5 text-brand-gold text-[10px] font-bold uppercase">
                        <ShieldCheck size={12} /> Authenticity Guaranteed
                      </div>
                      <p className="text-[10px] leading-relaxed font-sans">
                        All paintings are accompanied by an official Certificate of Authenticity signed by the artist, detailing chemical compositions, canvas weight, and registration logs.
                      </p>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-10 space-y-3 pt-6 border-t border-brand-cream/10">
                    <button
                      onClick={() => handleWhatsAppInquiry(activePainting)}
                      className="w-full bg-brand-gold hover:bg-brand-white text-brand-black transition-all font-sans text-[10px] tracking-widest uppercase font-bold py-3.5 rounded-none flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} className="fill-current" />
                      Inquire / Purchase via WhatsApp
                    </button>
                    
                    <button
                      onClick={() => {
                        toggleWishlist(activePainting);
                      }}
                      className={`w-full border font-sans text-[10px] tracking-widest uppercase font-semibold py-3 rounded-none flex items-center justify-center gap-1.5 ${
                        isInWishlist(activePainting.id)
                          ? 'border-brand-gold text-brand-gold bg-brand-gold/10'
                          : 'border-brand-cream/30 hover:border-brand-gold text-brand-white hover:bg-brand-white/5'
                      }`}
                    >
                      <Heart size={12} className={isInWishlist(activePainting.id) ? 'fill-brand-gold' : ''} />
                      {isInWishlist(activePainting.id) ? 'Saved in Wishlist' : 'Save in Wishlist'}
                    </button>

                    <p className="text-center text-[9px] font-mono text-brand-white/50 pt-2">
                      📍 Secured Lahore Studio delivery | Global courier packing options available.
                    </p>
                  </div>

                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
