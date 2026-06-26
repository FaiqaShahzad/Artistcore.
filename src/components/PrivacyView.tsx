import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="bg-brand-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border border-brand-cream/80 bg-brand-white p-8 sm:p-12 rounded-lg shadow-sm">
          
          <div className="flex items-center gap-3 text-brand-gold border-b border-brand-cream pb-6 mb-8">
            <Shield size={24} />
            <h1 className="font-serif text-3xl text-brand-black tracking-wide">Privacy & Data Ledger</h1>
          </div>

          <div className="space-y-6 font-sans text-xs sm:text-sm text-brand-gray leading-relaxed tracking-wide">
            <p className="font-serif text-base italic text-brand-black">Effective Date: June 25, 2026</p>
            
            <p>
              At <strong>ARTISTCORE</strong>, we treat the confidentiality of our patrons and art collectors with absolute solemn reverence. This document outlines our data coordinates, privacy rules, and information governance.
            </p>

            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider mt-6">1. Data Coordinates Collection</h3>
            <p>
              We gather basic customer metrics during transaction processes or commission inquiries. This is limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact coordinates: Name, email address, and active WhatsApp number.</li>
              <li>Delivery coordinates: Hand-delivery physical coordinates inside Lahore, Pakistan.</li>
              <li>Design parameters: Sizing metrics for crochet frocks, and reference images for painting studies.</li>
            </ul>

            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider mt-6">2. No-Tracking Integrity</h3>
            <p>
              We are strictly opposed to intrusive client tracking. ARTISTCORE does not utilize behavioral surveillance cookies or trade your personal email lists to third-party digital marketing platforms. Your interactions stay entirely on our secure local ledger.
            </p>

            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider mt-6">3. Financial Credentials Safety</h3>
            <p>
              We prioritize zero-exposure processing. All advance payments are handled directly outside this application via client-initiated Easypaisa, JazzCash, or secure local Pakistani banking links. No digital bank details or PIN numbers are ever inputted, parsed, or processed inside our website servers.
            </p>

            <h3 className="font-serif text-lg font-bold text-brand-black uppercase tracking-wider mt-6">4. Archival and Deletion Rights</h3>
            <p>
              Art collectors and clients can request immediate removal or review of their registration coordinates, message logs, or design history by lodging a deletion request via our direct helpline.
            </p>

            <div className="mt-10 border-t border-brand-cream/65 pt-6 text-center text-[10px] text-brand-gold font-bold uppercase tracking-widest font-mono">
              ✦ ARTISTCORE Lahore Atelier Security Shield ✦
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
