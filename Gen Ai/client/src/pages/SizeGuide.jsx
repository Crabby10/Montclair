import React, { useState } from 'react';

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('tops');

  const topsSizes = [
    { size: 'S', chest: '94-99 cm', shoulder: '42 cm', length: '71 cm' },
    { size: 'M', chest: '100-105 cm', shoulder: '44 cm', length: '72.5 cm' },
    { size: 'L', chest: '106-111 cm', shoulder: '46 cm', length: '74 cm' },
    { size: 'XL', chest: '112-117 cm', shoulder: '48 cm', length: '75.5 cm' }
  ];

  const bottomsSizes = [
    { size: 'S', waist: '76-80 cm', hip: '92-96 cm', inseam: '81 cm' },
    { size: 'M', waist: '81-85 cm', hip: '97-101 cm', inseam: '81.5 cm' },
    { size: 'L', waist: '86-90 cm', hip: '102-106 cm', inseam: '82 cm' },
    { size: 'XL', waist: '91-95 cm', hip: '107-111 cm', inseam: '82.5 cm' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-brand-gold text-xs uppercase tracking-widest font-bold font-display">Fitting Directory</span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider font-display text-brand-black">Sizing Chart</h1>
        <p className="text-xs text-brand-midgrey font-sans font-light max-w-md mx-auto">
          Dimensions are measured flat across garments. Fits are built around structured, quiet luxury specifications.
        </p>
      </div>

      {/* Tabs selectors */}
      <div className="flex justify-center border-b border-brand-lightgrey/30 text-xs font-bold uppercase tracking-widest text-brand-midgrey mb-8">
        <button 
          onClick={() => setActiveTab('tops')} 
          className={`pb-3 px-6 border-b-2 ${activeTab === 'tops' ? 'border-brand-black text-brand-black' : 'border-transparent hover:text-brand-black'}`}
        >
          Shirts & Outerwear
        </button>
        <button 
          onClick={() => setActiveTab('bottoms')} 
          className={`pb-3 px-6 border-b-2 ${activeTab === 'bottoms' ? 'border-brand-black text-brand-black' : 'border-transparent hover:text-brand-black'}`}
        >
          Trousers & Bottoms
        </button>
      </div>

      {/* Size Tables */}
      <div className="overflow-x-auto border border-brand-lightgrey/30 p-4">
        {activeTab === 'tops' ? (
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-brand-lightgrey/30 text-[10px] uppercase tracking-wider text-brand-midgrey">
                <th className="pb-3">Size Tag</th>
                <th className="pb-3">Chest Width</th>
                <th className="pb-3">Shoulder Span</th>
                <th className="pb-3">Body Length</th>
              </tr>
            </thead>
            <tbody>
              {topsSizes.map((row) => (
                <tr key={row.size} className="border-b border-brand-lightgrey/10 font-light text-brand-black/90">
                  <td className="py-4 font-bold">{row.size}</td>
                  <td className="py-4">{row.chest}</td>
                  <td className="py-4">{row.shoulder}</td>
                  <td className="py-4">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-brand-lightgrey/30 text-[10px] uppercase tracking-wider text-brand-midgrey">
                <th className="pb-3">Size Tag</th>
                <th className="pb-3">Waist Span</th>
                <th className="pb-3">Hip Span</th>
                <th className="pb-3">Inseam Length</th>
              </tr>
            </thead>
            <tbody>
              {bottomsSizes.map((row) => (
                <tr key={row.size} className="border-b border-brand-lightgrey/10 font-light text-brand-black/90">
                  <td className="py-4 font-bold">{row.size}</td>
                  <td className="py-4">{row.waist}</td>
                  <td className="py-4">{row.hip}</td>
                  <td className="py-4">{row.inseam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SizeGuide;
