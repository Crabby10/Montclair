import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-brand-lightgrey/30 pb-8 mb-12 text-center">
        <span className="text-brand-gold text-xs uppercase tracking-widest font-bold font-display">Client Assistance</span>
        <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider font-display text-brand-black mt-2">Contact The Atelier</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Info Sidebar */}
        <div className="lg:col-span-5 space-y-8 pr-4">
          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase tracking-wider text-brand-black font-display">Concierge Support</h2>
            <p className="text-xs text-brand-midgrey leading-relaxed font-sans font-light">
              Our styling team and order concierge are available to assist with product specifications, custom drapes, or returns.
            </p>
          </div>

          <div className="space-y-4 text-xs font-sans text-brand-black/80">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-brand-gold stroke-[1.5]" />
              <span>concierge@montclair.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-brand-gold stroke-[1.5]" />
              <span>+1 (800) 555-8930</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-brand-gold stroke-[1.5] mt-0.5" />
              <span>
                Montclair Atelier Inc.<br/>
                5th Floor, 80 Mercer St<br/>
                New York, NY 10012
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-brand-lightgrey/10 border border-brand-lightgrey/20 p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Message Dispatched</h3>
              <p className="text-xs text-brand-midgrey font-sans">An Atelier representative will follow up via email within 12 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">First Name</label>
                  <input type="text" className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" required />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">Last Name</label>
                  <input type="text" className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" required />
                </div>
              </div>
              
              <div>
                <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">Email Address</label>
                <input type="email" className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" required />
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">Message</label>
                <textarea rows="5" className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" required></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-brand-beige hover:text-brand-black transition-luxury">
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
