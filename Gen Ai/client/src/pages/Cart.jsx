import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, CreditCard, Landmark, CheckCircle } from 'lucide-react';

const Cart = ({ cartItems = [], onUpdateQuantity, onRemoveItem }) => {
  const navigate = useNavigate();
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  
  // Checkout Form States
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });
  const [paymentGateway, setPaymentGateway] = useState('stripe'); // stripe or razorpay
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Pricing calculations
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState('');

  const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = subTotal >= 150 ? 0 : 15;
  const discountAmount = Math.round(subTotal * discount);
  const totalAmount = subTotal - discountAmount + shippingFee;

  // Free shipping indicators
  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (subTotal / freeShippingThreshold) * 100);
  const neededForFreeShipping = freeShippingThreshold - subTotal;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(0.1);
      setCouponStatus('10% DISCOUNT APPLIED');
    } else {
      setCouponStatus('INVALID COUPON CODE');
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Simulate Payment Gateway Handshake
      if (paymentGateway === 'stripe') {
        // Mocking API call to /api/payments/stripe/create-intent
        console.log('Calling /api/payments/stripe/create-intent for amount:', totalAmount);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      } else {
        // Mocking API call to /api/payments/razorpay/create-order
        console.log('Calling /api/payments/razorpay/create-order for amount:', totalAmount);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mocking signature verification /api/payments/razorpay/verify
        console.log('Verifying Razorpay signature checksum...');
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // 2. Mocking Order creation API: POST /api/orders
      console.log('Submitting order items to /api/orders...');
      const activeUserStr = localStorage.getItem('montclair_active_user');
      const activeUser = activeUserStr ? JSON.parse(activeUserStr) : null;
      
      const finalOrderId = `ORD_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const orderPayload = {
        id: finalOrderId,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        user: activeUser ? activeUser.email : 'guest@example.com',
        userName: activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : 'Guest Customer',
        items: cartItems.map(item => ({
          product: item.id,
          name: item.name,
          sku: `MONT-SKU-${item.id}-${item.size}`,
          size: item.size,
          color: item.color,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress,
        subTotal,
        discountAmount,
        shippingFee,
        totalAmount,
        paymentDetails: {
          gateway: paymentGateway,
          transactionId: `TXN_${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
          status: 'paid'
        },
        couponCode: discount > 0 ? 'WELCOME10' : ''
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('montclair_orders') || '[]');
      existingOrders.unshift(orderPayload);
      localStorage.setItem('montclair_orders', JSON.stringify(existingOrders));

      console.log('Order created successfully:', orderPayload);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setCreatedOrderId(finalOrderId);
      setOrderCompleted(true);
      
      // Clear Cart state items
      cartItems.length = 0; 

    } catch (err) {
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ORDER SUCCESS STATE RENDER
  if (orderCompleted) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4 space-y-6">
        <CheckCircle className="w-16 h-16 text-brand-gold mx-auto stroke-[1.5]" />
        <h1 className="text-xl font-bold uppercase tracking-widest text-brand-black font-display">Order Confirmed</h1>
        <p className="text-xs text-brand-midgrey font-sans">
          Thank you for choosing Montclair. Your transaction was processed successfully.
        </p>
        <div className="border border-brand-lightgrey/30 p-4 bg-brand-lightgrey/10 text-xs tracking-wider uppercase text-brand-black font-semibold">
          Order ID: {createdOrderId}
        </div>
        <p className="text-[10px] text-brand-midgrey font-light font-sans">
          A confirmation lookbook email with tracking credentials was dispatched to your inbox.
        </p>
        <Link to="/shop" className="mt-8 inline-block bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-brand-beige hover:text-brand-black transition-luxury">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  // EMPTY CART STATE RENDER
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <ShoppingBag className="w-12 h-12 text-brand-beige mx-auto mb-6 stroke-[1.5]" />
        <h1 className="text-xl font-bold uppercase tracking-widest text-brand-black font-display">Your Cart is Empty</h1>
        <p className="text-xs text-brand-midgrey mt-2 font-sans">You haven't added any quiet luxury items to your cart yet.</p>
        <Link to="/shop" className="mt-8 inline-block bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-brand-beige hover:text-brand-black transition-luxury">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-brand-lightgrey/30 pb-8 mb-12 flex justify-between items-baseline">
        <h1 className="text-3xl font-bold uppercase tracking-wider font-display text-brand-black">
          {isCheckoutMode ? 'Secure Checkout' : 'Shopping Cart'}
        </h1>
        {isCheckoutMode && (
          <button 
            onClick={() => setIsCheckoutMode(false)}
            className="text-[10px] text-brand-midgrey font-bold uppercase tracking-widest flex items-center hover:text-brand-black transition-luxury"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: LISTING OR SHIPMENT ADDRESS */}
        <div className="lg:col-span-8 space-y-6">
          {!isCheckoutMode ? (
            /* STANDARD CART MODE */
            <>
              {/* Shipping Progress bar */}
              <div className="bg-brand-lightgrey/10 border border-brand-lightgrey/20 p-6">
                {neededForFreeShipping > 0 ? (
                  <p className="text-xs text-brand-black/80 font-medium tracking-wide uppercase">
                    Add <span className="font-bold text-brand-gold">${neededForFreeShipping}</span> more to unlock <span className="font-bold">FREE SHIPPING</span>
                  </p>
                ) : (
                  <p className="text-xs text-brand-gold font-bold tracking-wide uppercase">
                    ✓ YOU HAVE UNLOCKED FREE WORLDWIDE EXPRESS SHIPPING!
                  </p>
                )}
                <div className="w-full bg-brand-lightgrey/40 h-1 mt-3.5 relative rounded-full">
                  <div 
                    className="bg-brand-gold h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border border-brand-lightgrey/30 p-4 items-center">
                    <div className="w-20 h-24 overflow-hidden aspect-[3/4] bg-brand-lightgrey/20 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-black font-display">{item.name}</h3>
                        <p className="text-[10px] text-brand-midgrey uppercase tracking-widest mt-1">
                          Size: {item.size} / Color: {item.color}
                        </p>
                        <span className="text-xs font-bold text-brand-black/80 font-sans mt-2 block">${item.price}</span>
                      </div>

                      <div className="flex items-center gap-6 self-end md:self-center">
                        <div className="flex items-center border border-brand-lightgrey/40">
                          <button 
                            onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                            className="px-2.5 py-1.5 hover:bg-brand-lightgrey/10 text-brand-black transition-luxury"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold text-brand-black font-sans">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="px-2.5 py-1.5 hover:bg-brand-lightgrey/10 text-brand-black transition-luxury"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => onRemoveItem(idx)}
                          className="text-brand-midgrey hover:text-brand-black transition-luxury"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* SECURE CHECKOUT ADDRESS & GATEWAYS FORM */
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-8">
              
              {/* Shipping Details */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-lightgrey/20 pb-2">
                  Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">Street Address</label>
                    <input 
                      type="text" 
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent text-brand-black" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent text-brand-black" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">State / Province</label>
                    <input 
                      type="text" 
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent text-brand-black" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">Postal Code</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent text-brand-black" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">Country</label>
                    <select 
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent text-brand-black"
                    >
                      <option>United States</option>
                      <option>India</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Toggle Selection */}
              <div className="space-y-4 pt-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-lightgrey/20 pb-2">
                  Payment Method
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('stripe')}
                    className={`border p-4 flex flex-col items-center justify-center space-y-2 transition-luxury ${paymentGateway === 'stripe' ? 'border-brand-black bg-brand-lightgrey/10 text-brand-black' : 'border-brand-lightgrey/30 text-brand-midgrey'}`}
                  >
                    <CreditCard className="w-5 h-5 stroke-[1.5]" />
                    <span className="text-[9px] uppercase font-bold tracking-widest">Credit Card (Stripe)</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('razorpay')}
                    className={`border p-4 flex flex-col items-center justify-center space-y-2 transition-luxury ${paymentGateway === 'razorpay' ? 'border-brand-black bg-brand-lightgrey/10 text-brand-black' : 'border-brand-lightgrey/30 text-brand-midgrey'}`}
                  >
                    <Landmark className="w-5 h-5 stroke-[1.5]" />
                    <span className="text-[9px] uppercase font-bold tracking-widest">UPI / NetBanking (Razorpay)</span>
                  </button>
                </div>

                {/* Gateway Inputs view */}
                <div className="p-6 border border-brand-lightgrey/30 bg-brand-lightgrey/10 rounded-sm">
                  {paymentGateway === 'stripe' ? (
                    <div className="space-y-3.5 text-left">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold block">Secure Stripe Card Frame</span>
                      <div>
                        <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="4242 •••• •••• ••••"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">Expiration Date</label>
                          <input 
                            type="text" 
                            placeholder="MM / YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider text-brand-black block mb-1">CVC Code</label>
                          <input 
                            type="password" 
                            placeholder="•••"
                            value={cardDetails.cvc}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                            className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 py-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block">Razorpay Gateway Tunnel</span>
                      <p className="text-[10px] text-brand-midgrey font-sans font-light">
                        Upon clicking place order, the secure Razorpay payment handler popup will launch to authenticate UPI, Wallets, or NetBanking drapes.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </form>
          )}
        </div>

        {/* RIGHT COLUMN: PRICING BREAKDOWN */}
        <div className="lg:col-span-4 bg-brand-lightgrey/10 border border-brand-lightgrey/20 p-6 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-lightgrey/20 pb-4">
            Order Summary
          </h2>

          {/* Mini items list in Checkout Mode */}
          {isCheckoutMode && (
            <div className="space-y-3 border-b border-brand-lightgrey/20 pb-4 max-h-[160px] overflow-y-auto pr-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-sans font-light text-brand-black/75">
                  <span className="truncate max-w-[180px]">{item.name} (×{item.quantity})</span>
                  <span className="font-semibold">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3.5 text-xs text-brand-black/80 font-sans font-light">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">${subTotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-gold">
                <span>Discount (WELCOME10)</span>
                <span className="font-semibold">-${discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold">
                {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
              </span>
            </div>
            <div className="border-t border-brand-lightgrey/20 pt-3 flex justify-between text-sm font-bold text-brand-black font-display uppercase tracking-wider">
              <span>Total</span>
              <span>${totalAmount}</span>
            </div>
          </div>

          {!isCheckoutMode ? (
            /* Coupon Form and proceed trigger */
            <>
              <form onSubmit={handleApplyCoupon} className="flex border-b border-brand-lightgrey/40 py-2">
                <input 
                  type="text" 
                  placeholder="COUPON CODE" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-transparent border-none text-xs text-brand-black placeholder-brand-midgrey w-full focus:outline-none tracking-widest uppercase font-sans"
                />
                <button type="submit" className="text-[10px] font-bold text-brand-black hover:text-brand-gold uppercase tracking-widest transition-luxury ml-2">
                  APPLY
                </button>
              </form>
              {couponStatus && (
                <p className="text-[10px] uppercase font-bold text-brand-gold tracking-wider">{couponStatus}</p>
              )}

              <button 
                onClick={() => setIsCheckoutMode(true)}
                className="w-full bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-brand-beige hover:text-brand-black transition-luxury flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Secure submit button in Checkout Mode */
            <button 
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-brand-beige hover:text-brand-black transition-luxury disabled:bg-brand-midgrey flex items-center justify-center"
            >
              {isProcessing ? 'PROCESSING PAYMENT...' : `PLACE ORDER • $${totalAmount}`}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Cart;
