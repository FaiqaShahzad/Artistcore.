import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, PlusCircle, Quote, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TestimonialsView: React.FC = () => {
  const { testimonials, setTestimonials } = useApp();

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !review) {
      alert('Please fill out all required fields.');
      return;
    }

    const newTestimonial = {
      id: `test-${Date.now()}`,
      name,
      role: role || 'Art Enthusiast, Lahore',
      review,
      rating,
      date: new Date().toISOString().split('T')[0]
    };

    setTestimonials(prev => [newTestimonial, ...prev]);
    setSuccess(true);
    
    // reset form
    setName('');
    setRole('');
    setReview('');
    setRating(5);

    setTimeout(() => {
      setSuccess(false);
      setFormOpen(false);
    }, 3000);
  };

  return (
    <div id="testimonials-page" className="bg-brand-white py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-brand-cream/60 pb-8">
          <div>
            <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold">Patron Logbook</span>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-brand-black leading-tight">
              Customer Testimonials
            </h1>
            <p className="mt-2.5 font-sans text-xs sm:text-sm text-brand-gray tracking-wide">
              Read pure, unsolicited reviews detailing the craftsmanship, packaging, and beauty of our Lahore-made creations.
            </p>
          </div>
          
          <button
            id="add-review-trigger"
            onClick={() => setFormOpen(!formOpen)}
            className="mt-6 md:mt-0 flex items-center gap-2 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-white font-sans text-xs tracking-widest uppercase font-bold py-3 px-6 transition-all rounded shadow shrink-0"
          >
            <PlusCircle size={14} /> Write A Review
          </button>
        </div>

        {/* Dynamic Add Review Form */}
        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-brand-cream/20 border border-brand-cream p-6 sm:p-10 rounded-lg max-w-2xl mx-auto">
                {success ? (
                  <div className="text-center py-6">
                    <CheckCircle className="text-emerald-500 mx-auto mb-3" size={40} />
                    <h3 className="font-serif text-xl text-brand-black">Thank you for your review!</h3>
                    <p className="text-xs text-brand-gray mt-1">Your feedback has been published onto our boutique ledger.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <h3 className="font-serif text-lg text-brand-black border-b border-brand-cream/40 pb-2">
                      🖋️ Share Your Artistcore Experience
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] tracking-widest uppercase font-bold text-brand-black block mb-1">Your Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Zara Shah"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:border-brand-gold focus:outline-none rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] tracking-widest uppercase font-bold text-brand-black block mb-1">Location / Designation</label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. DHA Phase 5, Lahore"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:border-brand-gold focus:outline-none rounded"
                        />
                      </div>
                    </div>

                    {/* Star Rating Select */}
                    <div>
                      <label className="text-[9px] tracking-widest uppercase font-bold text-brand-black block mb-1">Your Rating</label>
                      <div className="flex gap-1.5 text-brand-gold">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star size={20} className={star <= rating ? 'fill-brand-gold' : 'text-brand-gray/30'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] tracking-widest uppercase font-bold text-brand-black block mb-1">Your Review *</label>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Tell others about the organic cotton quality, portrait resemblance, or packaging care..."
                        rows={4}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:border-brand-gold focus:outline-none rounded resize-none"
                        required
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-brand-black hover:bg-brand-gold text-brand-white hover:text-brand-black font-sans text-xs tracking-widest uppercase font-bold py-3 px-8 transition-colors duration-300 rounded shadow"
                      >
                        Publish Review
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              id={`testimonial-card-${test.id}`}
              key={test.id}
              className="flex flex-col justify-between bg-brand-cream/10 border border-brand-cream/60 p-8 rounded hover:shadow-lg hover:border-brand-gold/40 transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 text-brand-gold/10 h-10 w-10 shrink-0" />
              
              <div>
                {/* Rating */}
                <div className="flex gap-1 text-brand-gold mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-brand-gold" />
                  ))}
                </div>

                <p className="font-serif text-sm sm:text-base italic leading-relaxed text-brand-black/90">
                  "{test.review}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-cream/40 flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-xs tracking-widest uppercase font-bold text-brand-black">
                    {test.name}
                  </h4>
                  <p className="text-[10px] text-brand-gold tracking-wide mt-0.5">
                    {test.role}
                  </p>
                </div>
                <span className="font-mono text-[9px] text-brand-gray uppercase">
                  {test.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
