import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const MOCK_ARTICLES = [
  {
    id: 1,
    title: 'The Art of Layering: A Minimalist Suit & Knitwear Guide',
    excerpt: 'Quiet luxury is rooted in layers. Learn how to combine fine merino wool knits with structured blazers for seamless transition from workspace to dinner.',
    category: 'Style Guides',
    date: 'June 02, 2026',
    author: 'Alexander V.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    title: 'Capsule Wardrobe Essentials: The Modern Gentleman’s Standard',
    excerpt: 'Building a premium wardrobe begins with fundamentals. Discover the essential t-shirts, tailored trousers, and jackets required for a complete wardrobe.',
    category: 'Wardrobe Essentials',
    date: 'May 24, 2026',
    author: 'Mark R.',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    title: 'Seasonal Transitions: Adapting Textures for Summer & Fall',
    excerpt: 'Understanding texture weights is the secret to year-round comfort. We explore transitioning from French linen to premium heavy cotton and merino blends.',
    category: 'Seasonal Fashion',
    date: 'May 10, 2026',
    author: 'James S.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600'
  }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Style Guides', 'Wardrobe Essentials', 'Seasonal Fashion', 'Grooming', 'Men\'s Fashion Trends'];

  const filteredArticles = selectedCategory === 'All' 
    ? MOCK_ARTICLES 
    : MOCK_ARTICLES.filter(a => a.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="border-b border-brand-lightgrey/30 pb-8 mb-12 text-center">
        <span className="text-brand-gold text-xs uppercase tracking-widest font-bold font-display">Montclair Magazine</span>
        <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider font-display text-brand-black mt-2">The Quiet Gentleman</h1>
        <p className="text-xs text-brand-midgrey mt-2 tracking-wide font-sans max-w-md mx-auto leading-relaxed">
          Editorial articles detailing fabrication insights, styling directories, and wardrobe optimization guides.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 border-b border-brand-lightgrey/10 pb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 text-[10px] uppercase font-bold tracking-widest transition-luxury border rounded-full ${selectedCategory === cat ? 'bg-brand-black text-brand-white border-brand-black' : 'border-brand-lightgrey/40 hover:border-brand-black text-brand-black'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredArticles.map(article => (
          <article key={article.id} className="group flex flex-col justify-between border border-brand-lightgrey/30 p-6">
            <div className="space-y-4">
              {/* Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-lightgrey/20">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-102" />
                <span className="absolute bottom-3 left-3 bg-brand-black text-brand-beige text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                  {article.category}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="flex items-center text-[9px] uppercase tracking-wider text-brand-midgrey space-x-4">
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {article.date}</span>
                <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> By {article.author}</span>
              </div>

              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-black font-display group-hover:text-brand-gold transition-luxury">
                {article.title}
              </h2>
              <p className="text-xs text-brand-black/70 leading-relaxed font-sans font-light">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-brand-lightgrey/10 mt-6">
              <Link to={`/blog/${article.id}`} className="text-[10px] font-bold uppercase tracking-widest text-brand-black flex items-center hover:text-brand-gold transition-luxury w-max">
                READ FULL ARTICLE <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
