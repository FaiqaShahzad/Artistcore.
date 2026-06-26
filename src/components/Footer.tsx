import React, { useState } from 'react';
import { useApp, ActiveTabType } from '../context/AppContext';
import { Instagram, Send, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, contactInfo, addSubscriber } = useApp();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'exists' | 'invalid'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('invalid');
      return;
    }
    
    const wasAdded = addSubscriber(email);
    if (wasAdded) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('exists');
    }
    
    setTimeout(() => setStatus('idle'), 4000);
  };

  const handleLinkClick = (tab: ActiveTabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-container" className="border-t border-brand-cream/80 bg-brand-black text-brand-white">
      {/* Newsletter Section */}
      <div id="newsletter-bar" className="border-b border-brand-cream/20 bg-[#171717] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-md">
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-brand-gold flex items-center gap-2">
              <Sparkles size={18} /> Join the Artistcore Circle
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-brand-white/70 font-sans tracking-wide">
              Receive private invitations to new fine art reveals, exclusive capsule crochet collections, and editorial journals.
            </p>
          </div>
          <form id="newsletter-form" onSubmit={handleSubscribe} className="relative w-full max-w-md flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-[#1F1F1F] border border-brand-cream/20 px-4 py-3 text-xs tracking-wider text-brand-white focus:border-brand-gold focus:outline-none transition-colors duration-300 rounded"
              required
            />
            <button
              type="submit"
              className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-sans text-xs tracking-widest uppercase font-bold py-3 px-6 transition-all duration-300 flex items-center justify-center gap-2 rounded shrink-0"
            >
              Subscribe <Send size={12} />
            </button>
            
            {/* Subscription feedback */}
            {status === 'success' && (
              <p className="absolute -bottom-6 left-0 text-[10px] text-emerald-400 font-medium tracking-wider">
                Successfully subscribed to our private registry. Thank you!
              </p>
            )}
            {status === 'exists' && (
              <p className="absolute -bottom-6 left-0 text-[10px] text-brand-gold font-medium tracking-wider">
                This email is already part of our circle.
              </p>
            )}
            {status === 'invalid' && (
              <p className="absolute -bottom-6 left-0 text-[10px] text-rose-400 font-medium tracking-wider">
                Please enter a valid email address.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div id="footer-links-grid" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-1 flex flex-col space-y-4">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-brand-gold">ARTISTCORE</span>
            <span className="text-[10px] tracking-[0.4em] uppercase text-brand-white/60">Lahore</span>
          </div>
          <p className="text-xs text-brand-white/70 font-sans leading-relaxed tracking-wide">
            Handcrafted luxury. Timeless crochet creations and original fine paintings meticulously crafted with absolute love and attention in the cultural heart of Pakistan.
          </p>
          <div className="flex space-x-4 pt-2">
            <a
              href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 flex items-center justify-center border border-brand-cream/20 rounded-full hover:border-brand-gold hover:text-brand-gold text-brand-white/80 transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={14} />
            </a>
            <a
              href={`https://tiktok.com/${contactInfo.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 flex items-center justify-center border border-brand-cream/20 rounded-full hover:border-brand-gold hover:text-brand-gold text-brand-white/80 transition-colors"
              aria-label="Follow us on TikTok"
            >
              <span className="font-sans text-[10px] font-bold">🎵</span>
            </a>
          </div>
        </div>

        {/* Collections Links */}
        <div>
          <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-brand-gold font-bold mb-4">Our Offerings</h4>
          <ul className="space-y-3 text-xs tracking-wider text-brand-white/70 font-sans">
            <li>
              <button onClick={() => handleLinkClick('crochet')} className="hover:text-brand-gold transition-colors">
                Crochet Baby Frocks
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('crochet')} className="hover:text-brand-gold transition-colors">
                Elegant Shoes & Caps
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('paintings')} className="hover:text-brand-gold transition-colors">
                Oil Portrait Paintings
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('paintings')} className="hover:text-brand-gold transition-colors">
                Fine Art Canvas Works
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('custom-orders')} className="hover:text-brand-gold transition-colors">
                Custom Commissions
              </button>
            </li>
          </ul>
        </div>

        {/* Brand Information */}
        <div>
          <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-brand-gold font-bold mb-4">The Maison</h4>
          <ul className="space-y-3 text-xs tracking-wider text-brand-white/70 font-sans">
            <li>
              <button onClick={() => handleLinkClick('about')} className="hover:text-brand-gold transition-colors">
                Our Heritage Story
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('blog')} className="hover:text-brand-gold transition-colors">
                Artistcore Journal
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('testimonials')} className="hover:text-brand-gold transition-colors">
                Customer Testimonials
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('faq')} className="hover:text-brand-gold transition-colors">
                Frequently Asked FAQs
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('contact')} className="hover:text-brand-gold transition-colors">
                Contact & Find Us
              </button>
            </li>
          </ul>
        </div>

        {/* Location & Policies */}
        <div className="flex flex-col space-y-4">
          <div>
            <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-brand-gold font-bold mb-4">Studio Location</h4>
            <p className="text-xs text-brand-white/70 font-sans leading-relaxed tracking-wide">
              {contactInfo.address}<br />
              Lahore, Pakistan
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm tracking-[0.2em] uppercase text-brand-gold font-bold mb-4">Legals</h4>
            <ul className="space-y-2 text-xs tracking-wider text-brand-white/70 font-sans">
              <li>
                <button onClick={() => handleLinkClick('privacy')} className="hover:text-brand-gold transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('terms')} className="hover:text-brand-gold transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Trademark Copyright bar */}
      <div id="footer-trademark" className="border-t border-brand-cream/10 py-6 px-4 sm:px-6 lg:px-8 text-center text-[10px] tracking-widest text-brand-white/50 uppercase font-sans">
        <p>© {new Date().getFullYear()} ARTISTCORE. All Rights Reserved. Crafted with Timeless Care in Lahore, Pakistan.</p>
      </div>
    </footer>
  );
};
