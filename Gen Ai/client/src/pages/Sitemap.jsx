import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  const links = [
    { label: 'Home Page', path: '/' },
    { label: 'Shop All Products', path: '/shop' },
    { label: 'Atelier Blog / Magazine', path: '/blog' },
    { label: 'Executive Account Dashboard', path: '/account' },
    { label: 'Your Wishlist', path: '/wishlist' },
    { label: 'Your Cart', path: '/cart' },
    { label: 'About Our Legacy', path: '/about' },
    { label: 'Contact Atelier Support', path: '/contact' },
    { label: 'Shipping & Returns Policies', path: '/shipping-returns' },
    { label: 'Fitting & Sizing Chart', path: '/size-guide' },
    { label: 'Order Tracking Portal', path: '/order-tracking' },
    { label: 'Frequently Asked Questions', path: '/faq' },
    { label: 'Privacy Regulations', path: '/privacy' },
    { label: 'Terms of Use Agreements', path: '/terms' }
  ];

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-2xl font-bold uppercase tracking-wider font-display text-brand-black">Atelier Sitemap</h1>
      <ul className="space-y-3 text-xs font-sans text-brand-black/80 font-light">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link to={link.path} className="hover:text-brand-gold transition-luxury underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sitemap;
