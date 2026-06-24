import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'Where do you source your fabrics?',
      a: 'We source long-staple cotton from Peru, organic flax linen from Northern France, and fine merino wool from historic mills in Biella, Italy. Every batch is certified for sustainable craftsmanship.'
    },
    {
      q: 'What is the "Atelier Drop Model"?',
      a: 'To avoid the environmental impacts of overproduction, we launch limited batch runs. We only produce garments based on precise consumer demand signals, maintaining scarcity and luxury value.'
    },
    {
      q: 'Can I change my order details after payment?',
      a: 'Because packaging procedures begin immediately at our atelier logistics hubs, changes to shipping address or sizes must be requested within 30 minutes of purchase by contacting Concierge Support.'
    },
    {
      q: 'How do I care for fine Merino Wool garments?',
      a: 'We recommend dry cleaning or delicate hand washing with cold water and dry wool soap. Garments must be dried flat and stored on wooden hangers to retain shoulder silhouettes.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-brand-gold text-xs uppercase tracking-widest font-bold font-display">Client Care</span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider font-display text-brand-black">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-brand-lightgrey/30 pb-4">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex justify-between items-center text-left text-xs uppercase font-bold tracking-wider text-brand-black py-3 focus:outline-none"
            >
              <span>{faq.q}</span>
              {openIdx === idx ? <ChevronUp className="w-4 h-4 text-brand-gold" /> : <ChevronDown className="w-4 h-4 text-brand-midgrey" />}
            </button>
            
            {openIdx === idx && (
              <p className="text-xs text-brand-black/75 leading-relaxed font-sans font-light pt-2 pr-6">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
