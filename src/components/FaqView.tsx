import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, HelpCircle, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FaqView: React.FC = () => {
  const { faqs, contactInfo } = useApp();

  const [activeCategory, setActiveCategory] = useState<'All' | 'General' | 'Crochet' | 'Paintings' | 'Custom Orders' | 'Payment & Delivery'>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const categories: ('All' | 'General' | 'Crochet' | 'Paintings' | 'Custom Orders' | 'Payment & Delivery')[] = [
    'All', 'General', 'Crochet', 'Paintings', 'Custom Orders', 'Payment & Delivery'
  ];

  const filteredFaqs = faqs.filter(faq => {
    return activeCategory === 'All' || faq.category === activeCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div id="faq-accordions-view" className="bg-brand-white py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold flex items-center justify-center gap-1.5">
            <HelpCircle size={12} /> Studio Assistance
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-brand-black leading-tight">
            Frequently Asked FAQs
          </h1>
          <p className="mt-3 font-sans text-xs sm:text-sm text-brand-gray tracking-wide">
            Find immediate answers regarding baby sizing adjustments, custom portrait commissions, and safe Lahore shipping coordinates.
          </p>
          <div className="mt-4 h-[1px] w-20 bg-brand-gold mx-auto" />
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-brand-cream/60 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenFaqId(null);
              }}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase font-bold transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-brand-black border-brand-black text-brand-white shadow-md'
                  : 'bg-brand-white hover:bg-brand-cream/40 border-brand-cream/60 text-brand-black/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                id={`faq-item-${faq.id}`}
                key={faq.id}
                className="border border-brand-cream/80 bg-brand-white hover:border-brand-gold/40 transition-colors duration-300 rounded overflow-hidden"
              >
                {/* Accordion Header Trigger */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 focus:outline-none"
                >
                  <h3 className="font-serif text-sm sm:text-base font-bold text-brand-black tracking-wide leading-snug">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={16}
                    className={`text-brand-gold shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expanding Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-brand-gray leading-relaxed tracking-wide font-sans border-t border-brand-cream/20 pt-4 bg-brand-cream/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-brand-cream/20 p-8 border border-brand-cream/50 rounded-lg text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xl">💬</span>
          <h3 className="font-serif text-xl sm:text-2xl text-brand-black">Still Have Questions?</h3>
          <p className="font-sans text-xs sm:text-sm text-brand-gray tracking-wide max-w-md mx-auto leading-relaxed">
            If you need detailed sizing help or want to share reference files for custom canvas portraits, feel free to start a dialogue directly on WhatsApp with Faiqa.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-[#25D366] hover:bg-[#20ba59] text-brand-white font-sans text-xs tracking-widest uppercase font-bold py-3.5 px-8 rounded items-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
            >
              <MessageCircle size={16} className="fill-current" /> Chat with Faiqa
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
