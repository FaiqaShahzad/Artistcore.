import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Phone, Mail, MapPin, Send, CheckCircle, Sparkles, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactView: React.FC = () => {
  const { contactInfo, addContactMessage } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    addContactMessage({
      name,
      email,
      subject,
      message
    });

    setSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');

    setTimeout(() => setSuccess(false), 5000);
  };

  const cleanWhatsappNumber = contactInfo.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div id="contact-us-view" className="bg-brand-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold flex items-center justify-center gap-1.5">
            <Sparkles size={12} /> Reach the Atelier
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-brand-black leading-tight">
            Contact Us
          </h1>
          <p className="mt-3 font-sans text-xs sm:text-sm text-brand-gray tracking-wide">
            Have questions about standard pricing, custom sizing adjustments, or fine portrait commissions? Send us a message or connect directly.
          </p>
          <div className="mt-4 h-[1px] w-20 bg-brand-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          
          {/* Left Details Panel */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-brand-cream/20 border border-brand-cream p-8 rounded-lg space-y-6">
              
              <h3 className="font-serif text-xl sm:text-2xl text-brand-black border-b border-brand-cream/60 pb-3">
                Atelier Coordinates
              </h3>
              
              <div className="space-y-5 font-sans text-xs sm:text-sm">
                
                {/* WhatsApp */}
                <div className="flex items-start space-x-3.5">
                  <MessageCircle className="text-brand-gold mt-1 shrink-0" size={18} />
                  <div>
                    <h4 className="font-serif font-bold tracking-wider uppercase text-brand-black text-xs">WhatsApp Helpline</h4>
                    <p className="text-brand-gray mt-1">{contactInfo.whatsapp}</p>
                    <a
                      href={`https://wa.me/${cleanWhatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] tracking-widest uppercase font-bold text-brand-gold hover:text-brand-black mt-1.5 inline-block transition-colors"
                    >
                      Connect Instantly →
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <Mail className="text-brand-gold mt-1 shrink-0" size={18} />
                  <div>
                    <h4 className="font-serif font-bold tracking-wider uppercase text-brand-black text-xs">Email Correspondence</h4>
                    <p className="text-brand-gray mt-1">{contactInfo.email}</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-[10px] tracking-widest uppercase font-bold text-brand-gold hover:text-brand-black mt-1.5 inline-block transition-colors"
                    >
                      Draft Email →
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-3.5">
                  <MapPin className="text-brand-gold mt-1 shrink-0" size={18} />
                  <div>
                    <h4 className="font-serif font-bold tracking-wider uppercase text-brand-black text-xs">Lahore Studio Address</h4>
                    <p className="text-brand-gray mt-1 leading-relaxed">
                      {contactInfo.address}<br />
                      Lahore, Punjab, Pakistan
                    </p>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-brand-gold font-semibold mt-1 block">
                      📍 Appointments Only
                    </span>
                  </div>
                </div>

                {/* Socials */}
                <div className="flex items-start space-x-3.5 border-t border-brand-cream/40 pt-5">
                  <Instagram className="text-brand-gold mt-0.5 shrink-0" size={18} />
                  <div>
                    <h4 className="font-serif font-bold tracking-wider uppercase text-brand-black text-xs">Digital Journal</h4>
                    <p className="text-brand-gray mt-1">Instagram: {contactInfo.instagram}</p>
                    <p className="text-brand-gray mt-0.5">TikTok: {contactInfo.tiktok}</p>
                  </div>
                </div>

              </div>

              {/* Direct Quick Dial Call button */}
              <div className="pt-4">
                <a
                  href={`tel:${contactInfo.whatsapp}`}
                  className="w-full text-center border border-brand-black hover:bg-brand-black hover:text-brand-white text-brand-black transition-all font-sans text-[10px] tracking-widest uppercase font-bold py-3.5 rounded flex items-center justify-center gap-2 shadow-inner"
                >
                  <Phone size={12} /> Call Direct Line
                </a>
              </div>

            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-brand-white border border-brand-cream/80 p-6 sm:p-10 rounded-lg shadow-xl">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-4"
                  >
                    <CheckCircle className="text-emerald-500 mx-auto" size={48} />
                    <h3 className="font-serif text-2xl text-brand-black">Message Registered</h3>
                    <p className="font-sans text-xs text-brand-gray leading-relaxed tracking-wide max-w-sm mx-auto">
                      Your inquiry has been successfully transmitted directly to Faiqa S. and is logged in our local CMS inbox. We typically reply within 12 working hours.
                    </p>
                  </motion.div>
                ) : (
                  <form key="contact-form" onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="font-serif text-lg text-brand-black border-b border-brand-cream/40 pb-2 flex items-center gap-2">
                      ✉️ Transmit Your Letter
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">Email Address *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. client@domain.com"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">Subject Header *</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Inquiry regarding custom baby frock..."
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">Message Body *</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your beautiful query detailing standard sizes, colors, portrait sketches required..."
                        rows={5}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded resize-none"
                        required
                      />
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[9px] font-mono text-brand-gold font-bold uppercase">🔒 Local CMS Synchronization Ready</span>
                      <button
                        type="submit"
                        className="bg-brand-black hover:bg-brand-gold text-brand-white hover:text-brand-black transition-all duration-500 font-sans text-xs tracking-widest uppercase font-bold py-3.5 px-10 rounded shadow-md flex items-center gap-2"
                      >
                        Transmit Letter <Send size={12} />
                      </button>
                    </div>

                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* 4. Google Maps Section - Real looking iframe centered in Lahore */}
        <div id="google-maps-section" className="mt-16 rounded-lg overflow-hidden border border-brand-cream shadow-md">
          <iframe
            title="Artistcore Studio Lahore"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13606.611111111111!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045a270077ef%3A0xa14c45a270077ef!2sGulberg%20III%2C%20Lahore%2C%20Punjab!5e0!3m2!1sen!2spk!4v1716662442"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </div>
  );
};
