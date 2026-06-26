import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Heart, Sparkles, Feather } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { homepageContent, contactInfo } = useApp();

  return (
    <div id="about-view" className="bg-brand-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Top Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold flex items-center justify-center gap-1.5">
            <Feather size={12} /> The Artisan Atelier
          </span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-light tracking-wide text-brand-black leading-tight">
            Preserving Slow Art in a Fast-Paced World
          </h1>
          <div className="mt-6 h-[1px] w-28 bg-brand-gold mx-auto" />
        </div>

        {/* Story Grid with Double Images & Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center mb-24">
          
          {/* Left Large Creative Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded overflow-hidden shadow-2xl border border-brand-cream/60 bg-brand-cream/10">
              <img
                src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600"
                alt="Detailed hand knitting process"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/25 via-transparent to-transparent" />
            </div>
            {/* Embedded Small Floating Card */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-brand-black text-brand-white p-6 max-w-xs rounded shadow-2xl border border-brand-cream/20">
              <p className="font-serif text-sm italic text-brand-gold">
                "An heirloom garment or fine painting is not just an object—it's a recorded capsule of human attention and time."
              </p>
              <p className="mt-3 font-sans text-[10px] tracking-widest uppercase font-bold text-brand-white/70">
                — Faiqa S., Founder
              </p>
            </div>
          </div>

          {/* Right Text Block */}
          <div className="lg:col-span-6 flex flex-col space-y-6 lg:pl-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-black font-semibold tracking-wide">
              Our Journey & Sourcing Philosophy
            </h2>
            <p className="font-sans text-xs sm:text-sm text-brand-gray tracking-wide leading-relaxed">
              Based in Lahore, Pakistan, ARTISTCORE was founded as a passionate rebellion against the disposable, synthetic culture of mass-market imports. Witnessing how plastic-blended clothing and digital reproductions flooded our local landscapes, we chose a deliberate, more noble path. 
            </p>
            <p className="font-sans text-xs sm:text-sm text-brand-gray tracking-wide leading-relaxed">
              For our crochet baby frocks, booties, and accessories, we strictly source 100% organic Pakistani cotton and premium milk-cotton fibers. This local selection supports small farming co-ops across the Punjab region and guarantees that every single loop is completely hypoallergenic, cloud-soft, and safe for newborn skin. 
            </p>
            <p className="font-sans text-xs sm:text-sm text-brand-gray tracking-wide leading-relaxed">
              Our portrait paintings follow a centuries-old layering technique. From charcoal underdrawings to successive glazes of professional artist oils on Belgian linen, we construct portraits that preserve life, depth, and character under shifting indoor light.
            </p>
          </div>

        </div>

        {/* Three Core Pillars of Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 bg-brand-cream/20 p-8 sm:p-12 rounded-lg border border-brand-cream/40 mb-24">
          
          <div className="flex flex-col space-y-4">
            <div className="h-10 w-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Sparkles size={18} />
            </div>
            <h3 className="font-serif text-lg text-brand-black font-bold tracking-wide">Ethical Sourcing</h3>
            <p className="font-sans text-xs sm:text-sm text-brand-gray leading-relaxed tracking-wide">
              We exclusively source verified organic cotton and archival-grade linseed canvases, completely eliminating synthetic microplastics from our manufacturing pipeline.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="h-10 w-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Heart size={18} />
            </div>
            <h3 className="font-serif text-lg text-brand-black font-bold tracking-wide">Absolute Gentle Care</h3>
            <p className="font-sans text-xs sm:text-sm text-brand-gray leading-relaxed tracking-wide">
              Every crochet creation is steam-sterilized at 100°C using organic lavender vapors, ensuring they are pristine and soft before luxury packaging and delivery.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="h-10 w-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-serif text-lg text-brand-black font-bold tracking-wide">Generational Longevity</h3>
            <p className="font-sans text-xs sm:text-sm text-brand-gray leading-relaxed tracking-wide">
              Our triple-knotted crochet weaves do not unravel, and our oil portrait canvases are varnished with high-grade UV-protectants to resist yellowing for 100+ years.
            </p>
          </div>

        </div>

        {/* Lahore Studio Portrait / Invitation Section */}
        <div className="border border-brand-cream/80 rounded overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-brand-white">
          <div className="aspect-[3/2] md:aspect-auto bg-brand-cream/10">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600"
              alt="Artistic brush stroke close-up"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Visit Our Lahore Sanctuary</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-brand-black tracking-wide font-light">
              By Private Appointment Only
            </h3>
            <p className="font-sans text-xs sm:text-sm text-brand-gray leading-relaxed tracking-wide">
              Patrons wishing to consult on fine portraits or custom crochet collections can arrange a private gallery appointment at our studio in Gulberg III, Lahore, Pakistan. We offer sensory tactile reviews of premium thread swatches and portrait sketches.
            </p>
            <div className="text-xs font-mono text-brand-gold font-bold">
              📍 {contactInfo.location} — {contactInfo.address}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
