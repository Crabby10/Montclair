import React, { useState } from 'react';
import { Search, Package, MapPin, Check } from 'lucide-react';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    setSearched(true);
    if (orderId) {
      setTrackingInfo({
        id: orderId.toUpperCase(),
        carrier: 'DHL Express',
        status: 'In Transit',
        origin: 'Milan Atelier Hub',
        destination: 'New York Mercer St',
        milestones: [
          { label: 'Out for Local Delivery', completed: false, date: 'Pending' },
          { label: 'Cleared Customs Hub', completed: true, date: 'June 08, 2026' },
          { label: 'Dispatched from Milan', completed: true, date: 'June 06, 2026' },
          { label: 'Registered at Atelier', completed: true, date: 'June 05, 2026' }
        ]
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-brand-gold text-xs uppercase tracking-widest font-bold font-display">Logistics Concierge</span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider font-display text-brand-black">Order Tracking</h1>
        <p className="text-xs text-brand-midgrey font-sans font-light">Input your Atelier Reference ID or tracking receipt number.</p>
      </div>

      <form onSubmit={handleTrack} className="flex border-b border-brand-black py-2">
        <input 
          type="text" 
          placeholder="ENTER ATELIER ORDER REFERENCE ID" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="bg-transparent border-none text-xs text-brand-black placeholder-brand-midgrey w-full focus:outline-none tracking-widest uppercase font-sans"
          required
        />
        <button type="submit" className="text-[10px] font-bold text-brand-black hover:text-brand-gold uppercase tracking-widest transition-luxury ml-2">
          TRACK
        </button>
      </form>

      {searched && trackingInfo && (
        <div className="border border-brand-lightgrey/30 p-6 bg-brand-lightgrey/10 space-y-6">
          <div className="flex justify-between items-baseline border-b border-brand-lightgrey/20 pb-4">
            <div>
              <span className="text-[9px] text-brand-midgrey uppercase tracking-wider">Tracking Reference</span>
              <strong className="text-sm font-bold text-brand-black uppercase block mt-1">{trackingInfo.id}</strong>
            </div>
            <span className="bg-brand-gold text-brand-white text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest">
              {trackingInfo.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-sans text-brand-black/80">
            <div>
              <span className="text-brand-midgrey block text-[10px] uppercase tracking-wider mb-0.5">Carrier</span>
              <span className="font-semibold">{trackingInfo.carrier}</span>
            </div>
            <div>
              <span className="text-brand-midgrey block text-[10px] uppercase tracking-wider mb-0.5">Route</span>
              <span className="font-semibold">{trackingInfo.origin} → {trackingInfo.destination}</span>
            </div>
          </div>

          {/* Milestones list */}
          <div className="space-y-4 pt-4 border-t border-brand-lightgrey/20">
            {trackingInfo.milestones.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 ${step.completed ? 'bg-brand-black text-brand-beige border-brand-black' : 'border-brand-lightgrey/40 bg-brand-white text-brand-midgrey'}`}>
                  {step.completed ? <Check className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                </div>
                <div className="text-xs font-sans">
                  <span className={`font-bold block uppercase tracking-wider ${step.completed ? 'text-brand-black' : 'text-brand-midgrey font-medium'}`}>{step.label}</span>
                  <span className="text-[10px] text-brand-midgrey block mt-0.5">{step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
