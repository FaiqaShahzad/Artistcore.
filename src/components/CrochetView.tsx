import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Search, SlidersHorizontal, Heart, ShoppingCart, MessageCircle, X, Shield, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CrochetView: React.FC = () => {
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    contactInfo 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Baby Frocks' | 'Shoes' | 'Caps' | 'Accessories'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'low-high' | 'high-low'>('default');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customChest, setCustomChest] = useState('');
  const [customLength, setCustomLength] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Categories
  const categories: ('All' | 'Baby Frocks' | 'Shoes' | 'Caps' | 'Accessories')[] = [
    'All', 'Baby Frocks', 'Shoes', 'Caps', 'Accessories'
  ];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    return 0; // default order
  });

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || 'One Size');
    setQuantity(1);
    setCustomChest('');
    setCustomLength('');
    setCustomNotes('');
  };

  const handleAddToCartClick = () => {
    if (!selectedProduct) return;
    
    // Add custom specifications to name/description if provided
    const specNote = (customChest || customLength || customNotes) 
      ? ` [Specs: Chest ${customChest || 'Std'}, Length ${customLength || 'Std'}, Note: ${customNotes || 'None'}]` 
      : '';
      
    const customizedItem = {
      ...selectedProduct,
      name: `${selectedProduct.name}${specNote}`
    };

    addToCart(customizedItem, 'crochet', quantity, selectedSize);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleWhatsAppOrder = (product: Product) => {
    const specsText = (customChest || customLength || customNotes)
      ? `%0D%0A- Size: ${selectedSize}%0D%0A- Chest: ${customChest || 'Std'} inches%0D%0A- Length: ${customLength || 'Std'} inches%0D%0A- Details: ${customNotes || 'None'}`
      : `%0D%0A- Size: ${selectedSize}`;

    const text = `Assalam-o-Alaikum Artistcore! I would like to order/inquire about the handmade crochet product:%0D%0A%0D%0A*${product.name}*%0D%0APrice: PKR ${product.price.toLocaleString()}${specsText}%0D%0AQuantity: ${quantity}%0D%0APlease guide me on the 50% advance payment details.`;
    
    const whatsappNumber = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div id="crochet-collection-view" className="bg-brand-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Meta */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold">Premium Catalog</span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-brand-black leading-tight">
            Handmade Crochet Collection
          </h1>
          <p className="mt-3 font-sans text-xs sm:text-sm text-brand-gray tracking-wide leading-relaxed">
            Hypoallergenic organic cotton, premium double-lock stitching, and timeless Pakistani designs tailored for modern heirlooms.
          </p>
        </div>

        {/* Filter Controls (Responsive Search + Sort + Categories) */}
        <div id="filter-container" className="border border-brand-cream/60 p-6 rounded-none bg-brand-cream/10 mb-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search frocks, booties, caps..."
                className="w-full bg-brand-white border border-brand-cream pl-10 pr-4 py-2.5 text-xs tracking-wider focus:border-brand-gold focus:outline-none rounded-none"
              />
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <SlidersHorizontal size={14} className="text-brand-gray" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-brand-white border border-brand-cream px-3 py-2 text-xs tracking-wider focus:border-brand-gold focus:outline-none rounded-none cursor-pointer"
              >
                <option value="default">Default Sorting</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-t border-brand-cream/40 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[10px] tracking-widest uppercase font-bold rounded-none transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-brand-black text-brand-white shadow-md'
                    : 'bg-brand-white hover:bg-brand-gold/10 text-brand-black/70 border border-brand-cream'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-brand-cream rounded-none bg-brand-cream/5">
            <p className="font-serif text-lg text-brand-black/70 italic">No crochet items match your filters.</p>
            <button 
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-gold border-b border-brand-gold pb-0.5"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <div 
                id={`crochet-product-${product.id}`}
                key={product.id}
                className="group flex flex-col bg-brand-white border border-brand-cream/50 rounded-none overflow-hidden shadow-[0_10px_30px_rgba(201,168,106,0.03)] hover:shadow-[0_10px_30px_rgba(201,168,106,0.11)] transition-all duration-300"
              >
                {/* Image Wrap */}
                <div className="aspect-square relative overflow-hidden bg-brand-white border-b border-brand-cream/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category Stamp */}
                  <div className="absolute top-3 left-3 bg-brand-black text-brand-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-none">
                    {product.category}
                  </div>
                  {/* Quick-Action Buttons */}
                  <div className="absolute bottom-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="h-8 w-8 flex items-center justify-center bg-brand-white text-brand-black hover:bg-brand-gold rounded-full shadow border border-brand-cream transition-colors duration-300"
                      title="Add to Wishlist"
                    >
                      <Heart size={14} className={isInWishlist(product.id) ? 'fill-brand-gold text-brand-gold' : ''} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProduct(product);
                      }}
                      className="h-8 w-8 flex items-center justify-center bg-brand-white text-brand-black hover:bg-brand-gold rounded-full shadow border border-brand-cream transition-colors duration-300"
                      title="Quick Add"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-base tracking-wide text-brand-black font-semibold">
                      {product.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs font-bold text-brand-gold">
                      PKR {product.price.toLocaleString()}
                    </p>
                    <p className="mt-2.5 font-sans text-[11px] text-brand-gray tracking-wide line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleOpenProduct(product)}
                    className="mt-5 w-full text-center border border-brand-black py-2.5 text-[9px] font-bold tracking-widest uppercase hover:bg-brand-black hover:text-brand-white transition-all duration-300 rounded-none"
                  >
                    Configure & Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-brand-white z-50 shadow-2xl rounded-none overflow-y-auto border border-brand-cream"
            >
              <div className="relative p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 bg-brand-cream/30 hover:bg-brand-gold/25 rounded-none text-brand-black z-10 transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Left Product Image & Materials */}
                <div className="flex flex-col space-y-6">
                  <div className="aspect-square rounded-none overflow-hidden border border-brand-cream/50 bg-brand-cream/10 shadow-inner">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Materials */}
                  <div className="border-t border-brand-cream/40 pt-4">
                    <h4 className="text-[10px] tracking-widest uppercase font-bold text-brand-gold mb-2">Compositions</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.materials.map((mat, idx) => (
                        <span key={idx} className="bg-brand-cream/30 px-2.5 py-1 text-[9px] font-sans text-brand-black/85 rounded-none border border-brand-cream/20">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Sizing, Specs Form, & Order CTA */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-5">
                    <div>
                      <span className="bg-brand-gold/10 text-brand-gold px-2.5 py-1 text-[8px] font-bold tracking-widest uppercase rounded-none">
                        {selectedProduct.category}
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-brand-black tracking-wide font-bold mt-2.5">
                        {selectedProduct.name}
                      </h2>
                      <p className="font-mono text-lg font-bold text-brand-gold mt-1">
                        PKR {selectedProduct.price.toLocaleString()}
                      </p>
                    </div>

                    <p className="font-sans text-xs text-brand-gray tracking-wide leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    {/* Sizing selection */}
                    <div>
                      <h4 className="text-[10px] tracking-widest uppercase font-bold text-brand-black mb-2">Standard Sizes</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3.5 py-2 text-[10px] font-sans font-bold border transition-colors ${
                              selectedSize === size
                                ? 'border-brand-black bg-brand-black text-brand-white'
                                : 'border-brand-cream hover:border-brand-gold text-brand-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Measurements Inputs */}
                    <div className="bg-brand-cream/20 p-4 border border-brand-cream/40 rounded-none space-y-3">
                      <div className="flex items-center gap-1.5 text-brand-gold">
                        <Shield size={12} />
                        <h4 className="text-[9px] tracking-widest uppercase font-bold">Custom Tailoring (Optional)</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] tracking-wider uppercase text-brand-black/60 block mb-1">Chest (Inches)</label>
                          <input
                            type="text"
                            value={customChest}
                            onChange={(e) => setCustomChest(e.target.value)}
                            placeholder="e.g. 10.5"
                            className="w-full bg-brand-white border border-brand-cream px-2.5 py-1.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] tracking-wider uppercase text-brand-black/60 block mb-1">Length (Inches)</label>
                          <input
                            type="text"
                            value={customLength}
                            onChange={(e) => setCustomLength(e.target.value)}
                            placeholder="e.g. 14.0"
                            className="w-full bg-brand-white border border-brand-cream px-2.5 py-1.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] tracking-wider uppercase text-brand-black/60 block mb-1">Custom Notes / Colors</label>
                        <textarea
                          value={customNotes}
                          onChange={(e) => setCustomNotes(e.target.value)}
                          placeholder="e.g. Pastel lavender bows, no buttons..."
                          rows={2}
                          className="w-full bg-brand-white border border-brand-cream px-2.5 py-1.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black">Qty:</label>
                      <div className="flex items-center border border-brand-cream rounded-none">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1 text-xs font-bold hover:bg-brand-cream/30"
                        >
                          -
                        </button>
                        <span className="px-4 text-xs font-bold">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1 text-xs font-bold hover:bg-brand-cream/30"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="mt-8 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      
                      <button
                        onClick={handleAddToCartClick}
                        className="bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-white transition-all font-sans text-[10px] tracking-widest uppercase font-bold py-3.5 px-4 rounded-none flex items-center justify-center gap-1.5 shadow"
                      >
                        Add to Bag
                      </button>

                      <button
                        onClick={() => toggleWishlist(selectedProduct)}
                        className={`border font-sans text-[10px] tracking-widest uppercase font-semibold py-3.5 px-4 rounded-none flex items-center justify-center gap-1.5 ${
                          isInWishlist(selectedProduct.id)
                            ? 'border-brand-gold text-brand-gold bg-brand-gold/5'
                            : 'border-brand-cream hover:border-brand-gold text-brand-black'
                        }`}
                      >
                        <Heart size={14} className={isInWishlist(selectedProduct.id) ? 'fill-brand-gold' : ''} />
                        {isInWishlist(selectedProduct.id) ? 'Wishlisted' : 'Wishlist'}
                      </button>

                    </div>

                    <button
                      onClick={() => handleWhatsAppOrder(selectedProduct)}
                      className="w-full bg-[#25D366] hover:bg-[#20ba59] text-brand-white transition-all font-sans text-[10px] tracking-widest uppercase font-bold py-3.5 rounded-none flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} className="fill-current" />
                      Order via WhatsApp
                    </button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-[9px] font-medium text-brand-gray font-mono mt-2">
                      <RefreshCw size={10} /> 50% advance before crafting. Standard hand-delivery Lahore.
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Addition Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-50 bg-brand-black text-brand-white border border-brand-gold/40 px-6 py-3.5 rounded-none shadow-2xl flex items-center gap-3 text-xs font-bold tracking-wider uppercase font-sans whitespace-nowrap"
          >
            🛍️ Added item to your shopping bag
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
