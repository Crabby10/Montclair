import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-black text-brand-white pt-16 pb-8 border-t border-brand-darkgrey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Signature Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold tracking-[0.25em] text-brand-white uppercase font-display">
              Montclair
            </h3>
            <p className="text-xs text-brand-midgrey leading-relaxed max-w-xs">
              Crafting contemporary silhouettes and curated wardrobe essentials for the modern gentleman who values quiet luxury and confidence.
            </p>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-beige mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-midgrey">
              <li><Link to="/shop?category=t-shirts" className="hover:text-brand-white transition-luxury">T-Shirts</Link></li>
              <li><Link to="/shop?category=polos" className="hover:text-brand-white transition-luxury">Polo Shirts</Link></li>
              <li><Link to="/shop?category=shirts" className="hover:text-brand-white transition-luxury">Shirts</Link></li>
              <li><Link to="/shop?category=jackets" className="hover:text-brand-white transition-luxury">Jackets & Outerwear</Link></li>
              <li><Link to="/shop?category=trousers" className="hover:text-brand-white transition-luxury">Trousers & Jeans</Link></li>
              <li><Link to="/shop?category=blazers" className="hover:text-brand-white transition-luxury">Blazers & Suits</Link></li>
            </ul>
          </div>

          {/* Column 2: Assistance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-beige mb-4">
              Assistance
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-midgrey">
              <li><Link to="/contact" className="hover:text-brand-white transition-luxury">Customer Service</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-brand-white transition-luxury">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="hover:text-brand-white transition-luxury">Sizing Directory</Link></li>
              <li><Link to="/order-tracking" className="hover:text-brand-white transition-luxury">Track My Order</Link></li>
              <li><Link to="/faq" className="hover:text-brand-white transition-luxury">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-beige mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-brand-midgrey mb-4 leading-relaxed">
              Subscribe for early access drops, styling lookbooks, and private collections.
            </p>
            {submitted ? (
              <p className="text-xs text-brand-gold font-medium">Thank you for subscribing to Montclair.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-brand-beige/35 py-1.5">
                <input
                  type="email"
                  placeholder="ENTER EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none text-xs text-brand-white placeholder-brand-midgrey w-full focus:outline-none tracking-wider font-sans"
                  required
                />
                <button type="submit" className="text-xs font-bold text-brand-beige hover:text-brand-gold uppercase tracking-widest transition-luxury ml-2">
                  JOIN
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Legal Footer */}
        <div className="border-t border-brand-darkgrey pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] tracking-wider text-brand-midgrey uppercase">
          <p>© {new Date().getFullYear()} MONTCLAIR CLOTHING CO. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-brand-white transition-luxury">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand-white transition-luxury">Terms of Use</Link>
            <Link to="/sitemap" className="hover:text-brand-white transition-luxury">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
