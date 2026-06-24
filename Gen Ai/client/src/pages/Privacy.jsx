import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-2xl font-bold uppercase tracking-wider font-display text-brand-black">Privacy Policy</h1>
      <p className="text-xs text-brand-black/75 leading-relaxed font-sans font-light">
        At Montclair, we respect your privacy. This policy outlines how we handle user credentials, payment details, address profiles, and styling preferences. We do not sell or lease personal details to third parties. All transactional records are encrypted securely via Stripe and Razorpay integrations.
      </p>
      <p className="text-xs text-brand-black/75 leading-relaxed font-sans font-light">
        If you have questions regarding personal records deletion, contact the Atelier Concierge at concierge@montclair.com.
      </p>
    </div>
  );
};

export default Privacy;
