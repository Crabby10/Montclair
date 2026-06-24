import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-xl mx-auto space-y-4">
        <span className="text-brand-gold text-xs uppercase tracking-widest font-bold font-display">Our Legacy</span>
        <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider font-display text-brand-black">The Atelier Spirit</h1>
        <p className="text-xs text-brand-midgrey leading-relaxed font-sans font-light">
          Montclair is a study in texture, silhouette, and geometry. We design premium garments that offer confidence through simplicity.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] overflow-hidden bg-brand-lightgrey/30">
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" 
            alt="Tailoring design detail" 
            className="w-full h-full object-cover filter grayscale"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-brand-black font-display">Fabric Sourcing Integrity</h2>
          <p className="text-xs text-brand-black/75 leading-relaxed font-sans font-light">
            We partner exclusively with multi-generational family mills in Northern Italy, Peru, and France. By using high-staple organic cotton, flax linen, and raw merino wool, our products last for decades rather than seasons.
          </p>
          <p className="text-xs text-brand-black/75 leading-relaxed font-sans font-light">
            Each piece is custom dyed in small batches, reducing toxic runoff and maintaining vibrant drapes that evolve with wear.
          </p>
        </div>
      </div>

      {/* Atelier stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border-t border-b border-brand-lightgrey/30 py-12">
        <div>
          <span className="text-2xl font-extrabold text-brand-black font-display">100%</span>
          <span className="text-[10px] text-brand-midgrey uppercase tracking-widest block mt-2">Organic Sourced Fabrics</span>
        </div>
        <div>
          <span className="text-2xl font-extrabold text-brand-black font-display">Limited Drops</span>
          <span className="text-[10px] text-brand-midgrey uppercase tracking-widest block mt-2">No Deadstock Waste</span>
        </div>
        <div>
          <span className="text-2xl font-extrabold text-brand-black font-display">Personalized Box</span>
          <span className="text-[10px] text-brand-midgrey uppercase tracking-widest block mt-2">Recycled Box Packaging</span>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
