import React from 'react';

const Marquee = () => {
  const items = [
    'FREE SHIPPING WORLDWIDE',
    'PREMIUM FABRICS',
    'NEW ARRIVALS AVAILABLE',
    'EASY 30-DAY RETURNS',
    'MODERN ESSENTIALS',
    'LIMITED COLLECTIONS',
    '100% PREMIUM COTTON'
  ];

  // Repeat items to fill screen and create continuous effect
  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className="bg-brand-black text-brand-beige py-2.5 overflow-hidden whitespace-nowrap border-b border-brand-gold/20 select-none">
      <div className="inline-block animate-[marquee_25s_linear_infinite] uppercase text-xs tracking-[0.2em] font-medium">
        {repeatedItems.map((item, idx) => (
          <span key={idx} className="mx-8">
            {item} <span className="text-brand-gold ml-8">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
