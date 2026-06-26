import React, { useState } from 'react';
import { useApp, ActiveTabType } from '../context/AppContext';
import { Sparkles, ArrowRight, Play, Star, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const { 
    setActiveTab, 
    products, 
    paintings, 
    testimonials, 
    homepageContent,
    contactInfo 
  } = useApp();

  // Get active hero banner path
  const heroBannerSrc = '/src/assets/images/artistcore_hero_banner_1782419229099.jpg';

  const featuredCrochet = products.filter(p => p.featured).slice(0, 3);
  const featuredPaintings = paintings.filter(p => p.featured).slice(0, 2);

  // Testimonial Carousel state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Mock Instagram grid photos
  const instagramPhotos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=400', caption: 'Stitch by stitch, creating heirloom treasures.' },
    { id: 2, url: 'https://images.unsplash.com/photo-1579783922514-0235116aa3a2?q=80&w=400', caption: 'Noor of the Walled City - Oil on canvas detailing.' },
    { id: 3, url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400', caption: 'Organic cotton shoes for delicate newborn steps.' },
    { id: 4, url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400', caption: 'Golden reflections of Shalimar gardens in fine acrylics.' },
  ];

  return (
    <div id="home-view" className="relative overflow-hidden">
      
      {/* 1. Hero Section */}
      <section id="hero-section" className="relative bg-brand-cream/10 py-12 lg:py-24 border-b border-brand-cream/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Typography Column: Editorial Layout */}
            <div className="lg:col-span-5 flex flex-col space-y-8">
              <div className="space-y-4">
                <span className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold block">
                  Faiqa Shahzad
                </span>
                
                <h1 className="serif text-4xl sm:text-5xl lg:text-6xl font-light italic leading-[1.1] tracking-wide text-brand-black">
                  Timeless <br />
                  <span className="not-italic font-semibold text-brand-black">Creativity</span>
                </h1>
                
                <p className="sans text-sm text-brand-gray leading-relaxed max-w-[340px]">
                  {homepageContent.heroSubtitle}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md pt-2">
                <button
                  id="hero-cta-collection"
                  onClick={() => setActiveTab('crochet')}
                  className="matte-black text-white hover:bg-brand-gold text-brand-white hover:text-brand-black transition-all duration-300 font-sans text-[10px] uppercase tracking-widest font-semibold py-4.5 px-8 rounded-none shadow-lg flex items-center justify-between group"
                >
                  Explore Collection
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform ml-2" />
                </button>
                <button
                  id="hero-cta-custom"
                  onClick={() => setActiveTab('custom-orders')}
                  className="border border-brand-black text-brand-black hover:bg-brand-cream/50 transition-all duration-300 font-sans text-[10px] uppercase tracking-widest font-semibold py-4.5 px-8 rounded-none"
                >
                  Custom Commission
                </button>
              </div>
            </div>

            {/* Right Premium Banner: Dress Up with Artistic Overlay */}
            <div className="lg:col-span-7">
              <div className="relative group overflow-hidden rounded-none border border-brand-cream bg-brand-white shadow-[0_10px_30px_rgba(201,168,106,0.08)]">
                <div className="absolute top-4 right-4 z-10 bg-brand-white/95 px-4 py-1.5 rounded-none border border-brand-cream text-[9px] font-bold tracking-widest text-brand-black uppercase">
                  Featured Creation
                </div>
                <img
                  src={heroBannerSrc}
                  alt="Artistcore Luxury Crochet & Fine Art Showcase"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* Handmade Quality Overlay - extracted from design theme */}
                <div className="absolute bottom-6 left-6 text-brand-gold text-[9px] uppercase tracking-[0.5em] [writing-mode:vertical-lr] h-24 border-l border-brand-gold pl-2 hidden sm:block pointer-events-none opacity-80">
                  Handmade Quality
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Brand Story Section */}
      <section id="story-section" className="py-20 bg-brand-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold">The Heritage</span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl tracking-wide text-brand-black font-light">
            {homepageContent.storyTitle}
          </h2>
          <div className="mt-6 h-[1.5px] w-24 bg-brand-gold mx-auto" />
          <p className="mt-8 font-sans text-sm sm:text-base leading-relaxed text-brand-gray max-w-3xl mx-auto tracking-wide font-light">
            {homepageContent.storyText}
          </p>
          <div className="mt-8">
            <button
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-brand-gold hover:text-brand-black font-sans text-xs tracking-widest uppercase font-bold transition-colors inline-flex items-center gap-2 border-b border-brand-gold hover:border-brand-black pb-1"
            >
              Discover Our Philosophy <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Crochet Collection */}
      <section id="featured-crochet" className="py-20 bg-brand-cream/10 border-t border-brand-cream/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold font-bold">Heirloom Wear</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl tracking-wide font-light">Featured Crochet Pieces</h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('crochet');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-4 sm:mt-0 text-xs tracking-widest uppercase font-bold text-brand-black hover:text-brand-gold flex items-center gap-2 transition-colors border-b border-brand-cream/60 pb-1"
            >
              View Crochet Collection <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCrochet.map((product) => (
              <div 
                id={`featured-crochet-${product.id}`}
                key={product.id} 
                className="group relative flex flex-col bg-brand-white border border-brand-cream/50 rounded-none overflow-hidden shadow-[0_10px_30px_rgba(201,168,106,0.04)] hover:shadow-[0_10px_30px_rgba(201,168,106,0.12)] transition-all duration-300"
              >
                <div className="aspect-square w-full overflow-hidden bg-brand-white border-b border-brand-cream/30 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-brand-gold text-brand-black font-semibold px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase rounded-none">
                    {product.category}
                  </div>
                </div>
                <div className="flex flex-col p-6 flex-grow">
                  <h3 className="font-serif text-lg tracking-wide text-brand-black font-semibold">
                    {product.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-brand-gold font-bold">
                    PKR {product.price.toLocaleString()}
                  </p>
                  <p className="mt-3 font-sans text-xs text-brand-gray tracking-wide line-clamp-2">
                    {product.description}
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('crochet');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-6 w-full text-center border border-brand-black py-2.5 text-[10px] tracking-widest uppercase font-bold hover:bg-brand-black hover:text-brand-white transition-all duration-300 rounded-none"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Featured Paintings Gallery */}
      <section id="featured-paintings" className="py-20 bg-brand-white border-t border-brand-cream/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold font-bold">Fine Art Gallery</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl tracking-wide font-light">Featured Paintings</h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('paintings');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-4 sm:mt-0 text-xs tracking-widest uppercase font-bold text-brand-black hover:text-brand-gold flex items-center gap-2 transition-colors border-b border-brand-cream/60 pb-1"
            >
              View Paintings Gallery <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featuredPaintings.map((painting) => (
              <div 
                id={`featured-painting-${painting.id}`}
                key={painting.id} 
                className="group flex flex-col md:flex-row bg-brand-white border border-brand-cream/50 rounded-none overflow-hidden shadow-[0_10px_30px_rgba(201,168,106,0.04)] hover:shadow-[0_10px_30px_rgba(201,168,106,0.12)] transition-all duration-300"
              >
                <div className="md:w-1/2 aspect-[4/5] overflow-hidden bg-brand-white relative">
                  <img
                    src={painting.image}
                    alt={painting.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-brand-black text-brand-white text-[8px] font-mono tracking-widest uppercase px-2 py-1 rounded-none">
                    {painting.size}
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-between p-8">
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-brand-gold uppercase block mb-1">
                      {painting.category}
                    </span>
                    <h3 className="font-serif text-xl tracking-wide text-brand-black font-semibold">
                      {painting.title}
                    </h3>
                    <p className="mt-2 font-mono text-sm text-brand-gold font-bold">
                      PKR {painting.price.toLocaleString()}
                    </p>
                    <div className="mt-4 h-[1px] w-12 bg-brand-cream" />
                    <p className="mt-4 font-sans text-xs leading-relaxed text-brand-gray tracking-wide">
                      {painting.description}
                    </p>
                    <p className="mt-3 text-[10px] font-sans tracking-wide text-brand-black/60 italic">
                      Medium: {painting.medium}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setActiveTab('paintings');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-8 w-full text-center bg-brand-black text-brand-white hover:bg-brand-gold hover:text-brand-black py-3.5 text-[10px] tracking-widest uppercase font-bold transition-colors duration-300 rounded-none"
                  >
                    View in Lightbox
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Custom Orders Process */}
      <section id="custom-orders-process" className="py-20 bg-brand-black text-brand-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold font-bold">Personalized Creations</span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl tracking-wide font-light">Custom Commission Journey</h2>
            <p className="mt-4 font-sans text-xs sm:text-sm text-brand-white/60 tracking-wide leading-relaxed">
              We translate your unique dreams into real tactile heirlooms. Our collaborative workflow ensures full artistic alignment from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 border border-brand-cream/10 rounded-none bg-[#141414] hover:border-brand-gold/40 transition-colors">
              <div className="h-12 w-12 rounded-full border border-brand-gold/30 flex items-center justify-center font-serif text-xl text-brand-gold font-bold mb-6">
                1
              </div>
              <h3 className="font-serif text-lg tracking-wide text-brand-gold font-semibold">Submit Request</h3>
              <p className="mt-3 font-sans text-xs text-brand-white/70 leading-relaxed tracking-wide">
                Fill out our detailed custom commission brief, or click the floating button to start a personal dialogue with Faiqa on WhatsApp.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 border border-brand-cream/10 rounded-none bg-[#141414] hover:border-brand-gold/40 transition-colors">
              <div className="h-12 w-12 rounded-full border border-brand-gold/30 flex items-center justify-center font-serif text-xl text-brand-gold font-bold mb-6">
                2
              </div>
              <h3 className="font-serif text-lg tracking-wide text-brand-gold font-semibold">Approve Design</h3>
              <p className="mt-3 font-sans text-xs text-brand-white/70 leading-relaxed tracking-wide">
                We design custom color-swatch palettes for crochet, or charcoal/digital sketching studies for fine portraits for your review and approval.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 border border-brand-cream/10 rounded-none bg-[#141414] hover:border-brand-gold/40 transition-colors">
              <div className="h-12 w-12 rounded-full border border-brand-gold/30 flex items-center justify-center font-serif text-xl text-brand-gold font-bold mb-6">
                3
              </div>
              <h3 className="font-serif text-lg tracking-wide text-brand-gold font-semibold">Receive Handmade Creation</h3>
              <p className="mt-3 font-sans text-xs text-brand-white/70 leading-relaxed tracking-wide">
                Once the 50% advance is cleared, we begin crafting. Your masterfully detailed creation is packaged in luxury boxes and delivered.
              </p>
            </div>

          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => {
                setActiveTab('custom-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-brand-gold hover:bg-brand-white text-brand-black transition-all duration-300 font-sans text-xs tracking-widest uppercase font-bold py-4 px-10 rounded-none shadow-md"
            >
              Start Your Commission
            </button>
          </div>

        </div>
      </section>

      {/* 6. Why Choose ARTISTCORE */}
      <section id="why-choose-us" className="py-20 bg-brand-white border-b border-brand-cream/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold font-bold">Uncompromising Quality</span>
            <h2 className="mt-2 font-serif text-3xl tracking-wide font-light text-brand-black">Why Choose ARTISTCORE</h2>
            <div className="mt-4 h-[1px] w-16 bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            <div className="p-6 border border-brand-cream/40 rounded-none bg-brand-white flex flex-col justify-between shadow-[0_10px_30px_rgba(201,168,106,0.02)] hover:shadow-[0_10px_30px_rgba(201,168,106,0.08)] transition-all duration-300">
              <span className="text-2xl">🧶</span>
              <div>
                <h3 className="font-serif text-sm tracking-wider font-bold text-brand-black mt-4 uppercase">Handmade Quality</h3>
                <p className="mt-2 font-sans text-[11px] text-brand-gray leading-relaxed tracking-wide">
                  Every product is painstakingly crafted by Faiqa, stitch-by-stitch, guaranteeing peerless character.
                </p>
              </div>
            </div>

            <div className="p-6 border border-brand-cream/40 rounded-none bg-brand-white flex flex-col justify-between shadow-[0_10px_30px_rgba(201,168,106,0.02)] hover:shadow-[0_10px_30px_rgba(201,168,106,0.08)] transition-all duration-300">
              <span className="text-2xl">🌿</span>
              <div>
                <h3 className="font-serif text-sm tracking-wider font-bold text-brand-black mt-4 uppercase">Premium Materials</h3>
                <p className="mt-2 font-sans text-[11px] text-brand-gray leading-relaxed tracking-wide">
                  We strictly source certified 100% organic Egyptian and local cotton threads to prevent baby skin rashes.
                </p>
              </div>
            </div>

            <div className="p-6 border border-brand-cream/40 rounded-none bg-brand-white flex flex-col justify-between shadow-[0_10px_30px_rgba(201,168,106,0.02)] hover:shadow-[0_10px_30px_rgba(201,168,106,0.08)] transition-all duration-300">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="font-serif text-sm tracking-wider font-bold text-brand-black mt-4 uppercase">Custom Designs</h3>
                <p className="mt-2 font-sans text-[11px] text-brand-gray leading-relaxed tracking-wide">
                  Complete design control over colors, sizes, and frames to perfectly match your nursery theme or wall.
                </p>
              </div>
            </div>

            <div className="p-6 border border-brand-cream/40 rounded-none bg-brand-white flex flex-col justify-between shadow-[0_10px_30px_rgba(201,168,106,0.02)] hover:shadow-[0_10px_30px_rgba(201,168,106,0.08)] transition-all duration-300">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="font-serif text-sm tracking-wider font-bold text-brand-black mt-4 uppercase">Attention to Detail</h3>
                <p className="mt-2 font-sans text-[11px] text-brand-gray leading-relaxed tracking-wide">
                  Multiple checkpoints, fine lining insertions, double secure knots, and classical glazing portraits techniques.
                </p>
              </div>
            </div>

            <div className="p-6 border border-brand-cream/40 rounded-none bg-brand-white flex flex-col justify-between shadow-[0_10px_30px_rgba(201,168,106,0.02)] hover:shadow-[0_10px_30px_rgba(201,168,106,0.08)] transition-all duration-300">
              <span className="text-2xl">❤️</span>
              <div>
                <h3 className="font-serif text-sm tracking-wider font-bold text-brand-black mt-4 uppercase">Client Delight</h3>
                <p className="mt-2 font-sans text-[11px] text-brand-gray leading-relaxed tracking-wide">
                  Dedicated transparent order tracking, high-definition photo updates, and exquisite presentation boxes.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Testimonials Carousel Overview */}
      <section id="testimonials-preview" className="py-20 bg-brand-cream/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold">Patron Voices</span>
          <h2 className="mt-2 font-serif text-3xl tracking-wide font-light text-brand-black">Loved by Art Connoisseurs</h2>
          
          {testimonials.length > 0 && (
            <div className="mt-12 relative max-w-3xl mx-auto px-12">
              
              {/* Editorial Left-Border Testimonial Card */}
              <div className="bg-white p-8 md:p-12 text-left border-l-2 gold-border shadow-[0_10px_30px_rgba(201,168,106,0.06)] relative">
                {/* Stars */}
                <div className="flex space-x-1 text-brand-gold mb-4">
                  {[...Array(testimonials[currentTestimonialIndex].rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-serif text-lg sm:text-xl italic text-brand-black leading-relaxed">
                  "{testimonials[currentTestimonialIndex].review}"
                </p>

                {/* Review Author */}
                <div className="mt-6 flex justify-between items-end">
                  <div>
                    <p className="font-sans text-xs tracking-widest uppercase font-bold text-brand-black">
                      {testimonials[currentTestimonialIndex].name}
                    </p>
                    <p className="mt-1 font-sans text-[11px] text-brand-gold tracking-wider">
                      {testimonials[currentTestimonialIndex].role}
                    </p>
                  </div>
                  <span className="text-3xl text-brand-gold opacity-10 font-serif leading-none absolute right-8 bottom-4 select-none">”</span>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-brand-black/70 hover:text-brand-gold transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-brand-black/70 hover:text-brand-gold transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>

            </div>
          )}

          <div className="mt-10">
            <button
              onClick={() => {
                setActiveTab('testimonials');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs tracking-widest font-bold uppercase text-brand-black hover:text-brand-gold border-b border-brand-gold pb-1 transition-colors"
            >
              Read All Patrons Reviews
            </button>
          </div>
        </div>
      </section>

      {/* 8. Instagram Showcase */}
      <section id="instagram-showcase" className="py-20 bg-brand-white border-t border-brand-cream/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-md mx-auto mb-12">
            <span className="text-[10px] tracking-[0.4em] uppercase text-brand-gold font-bold">Aesthetic Feed</span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl tracking-wide font-light text-brand-black">Instagram Journal</h2>
            <a
              href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs font-semibold tracking-wider text-brand-gold hover:text-brand-black transition-colors block"
            >
              {contactInfo.instagram}
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPhotos.map((item) => (
              <a
                key={item.id}
                href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-brand-black rounded-none shadow-[0_10px_30px_rgba(201,168,106,0.02)]"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:opacity-75"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-[10px] font-sans text-brand-white leading-relaxed tracking-wide">
                    {item.caption}
                  </p>
                  <span className="mt-2 text-[8px] font-bold tracking-widest text-brand-gold uppercase flex items-center gap-1">
                    View on IG <ArrowRight size={8} />
                  </span>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* 9. Final Call To Action */}
      <section id="final-cta" className="relative bg-brand-cream/10 py-24 border-t border-brand-cream/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-6">
          <span className="text-2xl">🏛️</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-brand-black leading-tight">
            Bring Your Creative Vision To Life
          </h2>
          <p className="font-sans text-sm sm:text-base text-brand-gray tracking-wide leading-relaxed max-w-xl">
            Whether welcoming a newborn with organic cashmere-like baby boots or anchoring your study with a customized oil portrait, our Lahore atelier is ready.
          </p>
          <div className="pt-4">
            <button
              id="final-cta-button"
              onClick={() => {
                setActiveTab('custom-orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="matte-black hover:bg-brand-gold text-brand-white hover:text-brand-black transition-all duration-300 font-sans text-xs tracking-widest uppercase font-bold py-4.5 px-12 rounded-none shadow-[0_10px_30px_rgba(201,168,106,0.12)]"
            >
              Start Your Custom Order
            </button>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        id="floating-whatsapp"
        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-brand-white p-4 rounded-full shadow-2xl hover:bg-[#20ba59] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
        aria-label="Chat with Faiqa on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={24} className="fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs tracking-widest uppercase font-bold whitespace-nowrap">
          Order via WhatsApp
        </span>
      </a>

    </div>
  );
};
