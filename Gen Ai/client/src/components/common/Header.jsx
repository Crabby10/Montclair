import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';

const Header = ({ cartCount = 0, wishlistCount = 0, onCartClick }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full glassmorphism border-b border-brand-lightgrey/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-[0.25em] text-brand-black uppercase font-display hover:text-brand-gold transition-luxury">
              Montclair
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/shop" className="text-xs uppercase tracking-widest text-brand-black/70 hover:text-brand-black font-semibold transition-luxury">
              Shop All
            </Link>
            <Link to="/new-arrivals" className="text-xs uppercase tracking-widest text-brand-black/70 hover:text-brand-black font-semibold transition-luxury">
              New Arrivals
            </Link>
            <Link to="/best-sellers" className="text-xs uppercase tracking-widest text-brand-black/70 hover:text-brand-black font-semibold transition-luxury">
              Best Sellers
            </Link>
            <Link to="/collections" className="text-xs uppercase tracking-widest text-brand-black/70 hover:text-brand-black font-semibold transition-luxury">
              Collections
            </Link>
            <Link to="/blog" className="text-xs uppercase tracking-widest text-brand-black/70 hover:text-brand-black font-semibold transition-luxury">
              Blog
            </Link>
            <Link to="/about" className="text-xs uppercase tracking-widest text-brand-black/70 hover:text-brand-black font-semibold transition-luxury">
              About Us
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-6 text-brand-black">
            <button className="hover:text-brand-gold transition-luxury p-1" aria-label="Search">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            
            <Link to="/account" className="hover:text-brand-gold transition-luxury p-1" aria-label="Account">
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            <Link to="/wishlist" className="hover:text-brand-gold transition-luxury p-1 relative" aria-label="Wishlist">
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button onClick={onCartClick} className="hover:text-brand-gold transition-luxury p-1 relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-black text-brand-beige text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-brand-beige">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
