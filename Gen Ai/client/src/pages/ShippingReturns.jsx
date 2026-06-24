import React from 'react';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const ShippingReturns = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-brand-gold text-xs uppercase tracking-widest font-bold font-display">Client Guide</span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider font-display text-brand-black">Shipping & Returns</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-brand-lightgrey/30 py-8 text-center text-xs">
        <div className="space-y-2">
          <Truck className="w-5 h-5 mx-auto text-brand-gold stroke-[1.5]" />
          <h3 className="font-bold uppercase tracking-wider text-brand-black">Free Express</h3>
          <p className="text-brand-midgrey font-sans font-light">On all order amounts over $150 worldwide.</p>
        </div>
        <div className="space-y-2">
          <RotateCcw className="w-5 h-5 mx-auto text-brand-gold stroke-[1.5]" />
          <h3 className="font-bold uppercase tracking-wider text-brand-black">30-Day Returns</h3>
          <p className="text-brand-midgrey font-sans font-light">Easy returns and exchange on tagged garments.</p>
        </div>
        <div className="space-y-2">
          <ShieldCheck className="w-5 h-5 mx-auto text-brand-gold stroke-[1.5]" />
          <h3 className="font-bold uppercase tracking-wider text-brand-black">Duties Included</h3>
          <p className="text-brand-midgrey font-sans font-light">All international duties calculated at checkout.</p>
        </div>
      </div>

      <div className="space-y-6 text-xs leading-relaxed font-sans text-brand-black/80 font-light">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-black font-display">Delivery Timelines</h2>
          <p>We process capsule orders from Monday through Friday. Orders placed before 1:00 PM EST are dispatched on the same day from our logistics hub. Standard courier transit windows range between 2 and 5 business days globally depending on region constraints.</p>
        </section>
        
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-black font-display">Exchanges & Cancellations</h2>
          <p>If you require a different size or silhouette drape, you can launch an exchange request via your private Account portal. Return shipping labels are fully prepaid and complimentary. Items must be unworn and contain their original atelier tags.</p>
        </section>
      </div>
    </div>
  );
};

export default ShippingReturns;
