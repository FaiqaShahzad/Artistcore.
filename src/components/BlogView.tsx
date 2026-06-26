import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { Calendar, User, Clock, ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BlogView: React.FC = () => {
  const { blogs } = useApp();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Link copied to clipboard for sharing!');
    }
  };

  return (
    <div id="blog-journal-view" className="bg-brand-white py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            
            // 1. GRID LISTING VIEW
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-16"
            >
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[10px] tracking-[0.45em] text-brand-gold uppercase font-bold flex items-center justify-center gap-1.5">
                  <BookOpen size={12} /> The Artistcore Journal
                </span>
                <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-brand-black leading-tight">
                  Timeless Musings & Craft
                </h1>
                <p className="mt-3 font-sans text-xs sm:text-sm text-brand-gray tracking-wide">
                  Explore our design notes, fiber guides, and classical painting methodologies direct from our Lahore-based atelier.
                </p>
                <div className="mt-6 h-[1px] w-20 bg-brand-gold mx-auto" />
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {blogs.map((post) => (
                  <article
                    id={`blog-card-${post.id}`}
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer flex flex-col space-y-4 bg-brand-white border border-brand-cream/30 p-4 rounded hover:border-brand-gold/30 transition-colors"
                  >
                    {/* Cover image */}
                    <div className="aspect-[16/10] overflow-hidden rounded bg-brand-cream/10 border border-brand-cream/30">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-[10px] tracking-wider text-brand-gold font-mono uppercase font-bold">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                    </div>

                    {/* Content text */}
                    <div className="space-y-3">
                      <h2 className="font-serif text-xl sm:text-2xl text-brand-black font-semibold tracking-wide leading-snug group-hover:text-brand-gold transition-colors duration-300">
                        {post.title}
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-brand-gray tracking-wide leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-bold tracking-widest uppercase text-brand-black group-hover:text-brand-gold border-b border-brand-black group-hover:border-brand-gold pb-1 transition-colors">
                        Read Narrative →
                      </span>
                    </div>
                  </article>
                ))}
              </div>

            </motion.div>
          ) : (
            
            // 2. ARTICLE READER VIEW (EDITORIAL INDEPTH LAYOUT)
            <motion.div
              key="reader-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-10"
            >
              {/* Back to feed button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-black hover:text-brand-gold transition-colors"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Journal
              </button>

              {/* Title & Metadata */}
              <div className="space-y-4">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brand-black tracking-wide leading-tight">
                  {selectedPost.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 sm:gap-6 items-center text-[11px] text-brand-gray font-mono border-y border-brand-cream/60 py-4">
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> Published on {selectedPost.date}</span>
                  <span className="hidden sm:inline text-brand-cream/80">|</span>
                  <span className="flex items-center gap-1.5"><User size={12} /> Written by {selectedPost.author}</span>
                  <span className="hidden sm:inline text-brand-cream/80">|</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {selectedPost.readTime}</span>
                  
                  {/* Share button */}
                  <button 
                    onClick={() => handleShare(selectedPost)}
                    className="ml-auto flex items-center gap-1 text-brand-gold hover:text-brand-black uppercase text-[10px] tracking-widest font-bold"
                  >
                    <Share2 size={12} /> Share
                  </button>
                </div>
              </div>

              {/* Large Cover image */}
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-brand-cream/50 bg-brand-cream/10 shadow-lg">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Article Content - Styled for maximum comfortable reading */}
              <div id="editorial-body" className="font-sans text-sm sm:text-base text-brand-black/90 leading-relaxed tracking-wide space-y-6 max-w-none">
                {selectedPost.content.split('\n\n').map((para, index) => {
                  // Style markdown sub-headings or lists on-the-fly
                  if (para.startsWith('### ')) {
                    return (
                      <h3 key={index} className="font-serif text-xl sm:text-2xl font-bold text-brand-black pt-6 pb-2">
                        {para.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (para.startsWith('1. ') || para.startsWith('* ')) {
                    return (
                      <div key={index} className="bg-brand-cream/20 border-l-2 border-brand-gold pl-5 py-2 italic font-serif text-brand-black/80 my-4 text-base rounded-r">
                        {para.replace(/^(1\.\s|\*\s)/, '')}
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="font-light">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Bottom Editorial Quote */}
              <div className="border-t border-brand-cream/60 pt-10 text-center">
                <span className="text-brand-gold text-lg">✦</span>
                <p className="mt-2 font-serif text-sm italic text-brand-gray">
                  You have been reading an excerpt from the ARTISTCORE Atelier Journal.
                </p>
                <button
                  onClick={() => { setSelectedPost(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="mt-6 inline-block bg-brand-black hover:bg-brand-gold text-brand-white hover:text-brand-black font-sans text-xs tracking-widest uppercase font-bold py-3.5 px-8 transition-all rounded shadow"
                >
                  Return to Journal Feed
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
