import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Sparkles, ShieldCheck, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const CustomOrdersView: React.FC = () => {
  const { addCustomOrder, contactInfo } = useApp();

  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState<'crochet' | 'painting'>('crochet');
  
  // Form fields
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [details, setDetails] = useState('');
  const [sizePreference, setSizePreference] = useState('');
  const [colorScheme, setColorScheme] = useState('');
  
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmitBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !details) {
      alert('Please fill out all required fields.');
      return;
    }

    const orderId = `ART-${Date.now().toString().slice(-6)}`;
    const fullDetails = `${orderType === 'crochet' ? '[Crochet]' : '[Painting]'} Size: ${sizePreference || 'Std'}, Colors: ${colorScheme || 'Std'}. Details: ${details}`;
    
    // Push into context
    addCustomOrder({
      name,
      whatsapp,
      type: orderType,
      details: fullDetails
    });

    setSubmittedId(orderId);
    setStep(4); // Success Step
  };

  const handleLaunchWhatsApp = () => {
    const specsText = `%0D%0A- Order ID: *${submittedId}*%0D%0A- Name: ${name}%0D%0A- Sizing: ${sizePreference || 'Standard'}%0D%0A- Colors: ${colorScheme || 'Natural/Standard'}%0D%0A- Brief: ${details}`;
    const text = `Assalam-o-Alaikum Artistcore! I have successfully submitted a custom commission brief on your boutique website:%0D%0A${specsText}%0D%0A%0D%0APlease verify my booking and provide me the JazzCash/Easypaisa accounts or Bank details so I can transfer the 50% advance deposit. JazakAllah!`;
    const whatsappNum = contactInfo.whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${whatsappNum}?text=${text}`;
    
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetForm = () => {
    setName('');
    setWhatsapp('');
    setDetails('');
    setSizePreference('');
    setColorScheme('');
    setSubmittedId(null);
    setStep(1);
  };

  return (
    <div id="custom-commissions-view" className="bg-brand-white py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold flex items-center justify-center gap-1.5">
            <Sparkles size={12} /> Bespoke Commissions
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-brand-black leading-tight">
            Order Custom Design
          </h1>
          <div className="mt-4 h-[1px] w-20 bg-brand-gold mx-auto" />
        </div>

        {/* Payment Policy Notice Bar */}
        <div id="payment-policy-card" className="bg-brand-cream/30 border border-brand-cream p-6 rounded-none mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex items-start space-x-3">
            <ShieldCheck className="text-brand-gold mt-1 shrink-0" size={18} />
            <div>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-black">50% Advance Notice</h4>
              <p className="font-sans text-[11px] text-brand-gray mt-1 leading-relaxed">
                We require a 50% advance deposit to purchase materials and schedule slots. The remaining 50% is paid upon safe Lahore delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CreditCard className="text-brand-gold mt-1 shrink-0" size={18} />
            <div>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-black">Accepted Transfers</h4>
              <p className="font-sans text-[11px] text-brand-gray mt-1 leading-relaxed">
                Easypaisa, JazzCash, Direct Bank Transfer, or Online Interbank Funds Transfer are supported instantly.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-xl mt-0.5">📍</span>
            <div>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-black">Lahore Delivery</h4>
              <p className="font-sans text-[11px] text-brand-gray mt-1 leading-relaxed">
                White-glove courier hand-delivery is currently native to Lahore. Special shipping options are available upon discussion.
              </p>
            </div>
          </div>

        </div>

        {/* Step Progress Indicators */}
        {step < 4 && (
          <div className="flex items-center justify-center space-x-4 mb-10 font-sans text-xs tracking-wider font-semibold">
            <button 
              onClick={() => step > 1 && setStep(1)}
              className={`pb-1 ${step === 1 ? 'border-b-2 border-brand-gold text-brand-gold font-bold' : 'text-brand-black/40'}`}
            >
              1. Type Selection
            </button>
            <ChevronRight size={14} className="text-brand-gray/30" />
            <button 
              onClick={() => step > 2 && setStep(2)}
              className={`pb-1 ${step === 2 ? 'border-b-2 border-brand-gold text-brand-gold font-bold' : 'text-brand-black/40'}`}
            >
              2. Specifications
            </button>
            <ChevronRight size={14} className="text-brand-gray/30" />
            <span className={step === 3 ? 'border-b-2 border-brand-gold text-brand-gold font-bold' : 'text-brand-black/40'}>
              3. Contact & Terms
            </span>
          </div>
        )}

        {/* Multi-Step Wizard Content */}
        <div className="bg-brand-white border border-brand-cream/80 rounded-none p-6 sm:p-10 shadow-[0_10px_30px_rgba(201,168,106,0.06)]">
          
          {/* STEP 1: Select Type */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="font-serif text-xl text-brand-black">Which artistry can we create for you?</h3>
                <p className="text-xs text-brand-gray mt-1">Select the custom department of interest</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div 
                  id="select-type-crochet"
                  onClick={() => { setOrderType('crochet'); setStep(2); }}
                  className={`group cursor-pointer border p-8 rounded-none text-center transition-all duration-300 flex flex-col justify-between items-center h-64 ${
                    orderType === 'crochet' 
                      ? 'border-brand-gold bg-brand-gold/5 shadow-md' 
                      : 'border-brand-cream hover:border-brand-gold/40'
                  }`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">🧶</span>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-brand-black mt-4">Handcrafted Crochet</h4>
                    <p className="font-sans text-[11px] text-brand-gray mt-2 leading-relaxed max-w-xs">
                      Baby frocks, heirloom slippers, warm matching bonnets, blankets, and custom lace accessories.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold mt-4 group-hover:underline">
                    Configure Crochet →
                  </span>
                </div>

                <div 
                  id="select-type-painting"
                  onClick={() => { setOrderType('painting'); setStep(2); }}
                  className={`group cursor-pointer border p-8 rounded-none text-center transition-all duration-300 flex flex-col justify-between items-center h-64 ${
                    orderType === 'painting' 
                      ? 'border-brand-gold bg-brand-gold/5 shadow-md' 
                      : 'border-brand-cream hover:border-brand-gold/40'
                  }`}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">🎨</span>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-brand-black mt-4">Fine Art Paintings</h4>
                    <p className="font-sans text-[11px] text-brand-gray mt-2 leading-relaxed max-w-xs">
                      Stretched linen oil portraits, textured acrylic abstracts, gold-leaf studies, and calligraphy.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold mt-4 group-hover:underline">
                    Configure Paintings →
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: Input Specs */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-brand-cream pb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg text-brand-black flex items-center gap-2">
                  <span>{orderType === 'crochet' ? '🧶 Crochet Specs' : '🎨 Painting Specs'}</span>
                </h3>
                <button 
                  onClick={() => setStep(1)}
                  className="text-[10px] tracking-widest uppercase font-bold text-brand-gold hover:text-brand-black transition-colors"
                >
                  ← Go Back
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">
                    {orderType === 'crochet' ? "Child's Age or Sizing" : 'Canvas Size Preference'}
                  </label>
                  <input
                    type="text"
                    value={sizePreference}
                    onChange={(e) => setSizePreference(e.target.value)}
                    placeholder={orderType === 'crochet' ? 'e.g. 3-6 Months, 1 Year' : 'e.g. 18x24 inches, 2x3 feet'}
                    className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">
                    Color Palette Preferred
                  </label>
                  <input
                    type="text"
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value)}
                    placeholder={orderType === 'crochet' ? 'e.g. Cream & Baby Pink' : 'e.g. Gold leaf, teal, warm white'}
                    className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">
                  Detailed Specifications Brief *
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    orderType === 'crochet'
                      ? 'e.g. Please crochet a baby frock matching the Rosette style but with short sleeves and light green bows...'
                      : 'e.g. Oil painting portrait of my mother based on an old picture, I would like a warm golden-hour studio lighting style...'
                  }
                  rows={5}
                  className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none resize-none"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  id="custom-specs-next"
                  onClick={() => {
                    if (!details) {
                      alert('Please detail your brief specifications.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="bg-brand-black hover:bg-brand-gold text-brand-white hover:text-brand-black transition-all duration-300 font-sans text-xs tracking-widest uppercase font-bold py-3.5 px-8 rounded-none flex items-center gap-2"
                >
                  Continue to Contact Info <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Client Details */}
          {step === 3 && (
            <form onSubmit={handleSubmitBrief} className="space-y-6">
              <div className="border-b border-brand-cream pb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg text-brand-black">👤 Your Contact Details</h3>
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[10px] tracking-widest uppercase font-bold text-brand-gold hover:text-brand-black"
                >
                  ← Go Back
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">WhatsApp Contact *</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 0320-1195910"
                    className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none"
                    required
                  />
                </div>
              </div>

              {/* Confirm agreement with policies */}
              <div className="bg-brand-cream/20 p-4 border border-brand-cream/50 rounded-none space-y-3 font-sans text-xs text-brand-gray">
                <div className="flex items-start space-x-2.5">
                  <input 
                    type="checkbox" 
                    id="policyCheck" 
                    className="mt-0.5 accent-brand-gold" 
                    required 
                  />
                  <label htmlFor="policyCheck" className="cursor-pointer tracking-wide leading-relaxed">
                    I acknowledge that ARTISTCORE is a slow, custom artisanal studio. I agree to transfer the <strong>50% advance payment</strong> via JazzCash, Easypaisa, or Bank transfer prior to raw materials sourcing.
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <p className="text-[10px] font-mono text-brand-gold font-semibold uppercase">🔒 Verified Lahore Custom Booking</p>
                <button
                  id="submit-brief-button"
                  type="submit"
                  className="bg-brand-black hover:bg-brand-gold text-brand-white hover:text-brand-black transition-all duration-500 font-sans text-xs tracking-widest uppercase font-bold py-4 px-10 rounded-none shadow-lg"
                >
                  Submit Commission Brief
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Simulation & WhatsApp Trigger */}
          {step === 4 && (
            <div className="text-center py-6 space-y-6">
              <div className="mx-auto h-16 w-16 bg-emerald-100 text-emerald-600 rounded-none flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle size={36} />
              </div>

              <h3 className="font-serif text-3xl text-brand-black">Commission Brief Logged</h3>
              <p className="font-sans text-xs text-brand-gray tracking-wide max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>! Your customized order inquiry has been successfully registered in our local boutique database under ID <strong>{submittedId}</strong>. 
              </p>
              
              <div className="bg-brand-cream/30 border border-brand-cream/80 max-w-md mx-auto p-5 rounded-none space-y-4 text-left font-sans text-xs text-brand-gray">
                <p className="font-serif text-sm font-bold text-brand-black uppercase tracking-wider border-b border-brand-cream pb-1.5 text-center">
                  Advance Payment Processing
                </p>
                <p className="leading-relaxed tracking-wide">
                  To secure your scheduling slot, please send your 50% deposit to either of the following accounts:
                </p>
                <ul className="space-y-1.5 font-mono text-[11px] text-brand-black font-bold">
                  <li>📱 Easypaisa: 0320-1195910 (Faiqa S.)</li>
                  <li>📱 JazzCash: 0320-1195910 (Faiqa S.)</li>
                  <li>🏛️ Bank: Alfalah Ltd, Lahore, Acct: 5698-1254-001</li>
                </ul>
              </div>

              <div className="pt-4 space-y-4 max-w-sm mx-auto">
                <button
                  id="whatsapp-confirm-button"
                  onClick={handleLaunchWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-brand-white transition-all font-sans text-xs tracking-widest uppercase font-bold py-4 rounded-none flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle size={16} className="fill-current" />
                  Finalize on WhatsApp
                </button>

                <button
                  onClick={handleResetForm}
                  className="text-[10px] tracking-widest uppercase font-bold text-brand-gray hover:text-brand-black transition-colors"
                >
                  Book Another Custom Art Commission
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
