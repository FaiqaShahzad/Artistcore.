import React from 'react';
import { Scale } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="bg-brand-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border border-brand-cream/80 bg-brand-white p-8 sm:p-12 rounded-lg shadow-sm">
          
          <div className="flex items-center gap-3 text-brand-gold border-b border-brand-cream pb-6 mb-8">
            <Scale size={24} />
            <h1 className="font-serif text-3xl text-brand-black tracking-wide">Terms & Conditions</h1>
          </div>

          <div className="space-y-6 font-sans text-xs sm:text-sm text-brand-gray leading-relaxed tracking-wide">
            <p className="font-serif text-base italic text-brand-black">Last Updated: June 25, 2026</p>
            
            <p>
              Welcome to the digital atelier of <strong>ARTISTCORE</strong>. By exploring our handmade catalog, adding items to your bag, or submitting a custom commission brief, you are agreeing to abide by the following terms of art trade:
            </p>

            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider mt-6">1. 50% Advance Guarantee</h3>
            <p>
              Custom orders (including personalized baby crochet frocks and oil-on-canvas portrait paintings) are scheduled strictly upon confirmation of a <strong>50% advance deposit</strong>. No raw threads are purchased, and no canvas sketching begins prior to receiving the Easypaisa, JazzCash, or Bank Transfer confirmation code.
            </p>

            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider mt-6">2. Remaining Balance and Lahore Deliveries</h3>
            <p>
              The remaining 50% balance is payable immediately upon physical hand-delivery inside Lahore. For cross-province shipping (Karachi, Islamabad), the balance must be cleared prior to dispatching the secure courier container.
            </p>

            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider mt-6">3. Hand-Tailored Resemblance & Artistic License</h3>
            <p>
              ARTISTCORE creations are 100% handcrafted. This slow process guarantees that minor differences in crochet stitches, dye tone variations, or portrait brush glazes may manifest themselves between design sketches and the final item. These are not flaws but constitute the unique soul signature of human creation.
            </p>

            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider mt-6">4. Cancellation & Deposit Non-Refundability</h3>
            <p>
              Because raw organic material sourcing and dedicated slot reserving happen synchronously on advance transfer, custom commission cancellations requested beyond 48 hours of deposit receipt will result in forfeiture of the 50% advance to offset artist labor and physical materials cost.
            </p>

            <div className="mt-10 border-t border-brand-cream/65 pt-6 text-center text-[10px] text-brand-gold font-bold uppercase tracking-widest font-mono">
              ✦ ARTISTCORE Lahore Atelier Terms of Trade ✦
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
