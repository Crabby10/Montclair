import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, HelpCircle, Truck, RefreshCw, Shield, Plus, Minus } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const ProductDetail = ({ onAddToCart, onAddToWishlist }) => {
  const { slug } = useParams();
  const [products] = useState(() => {
    const local = localStorage.getItem('montclair_products');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return PRODUCTS;
  });
  const product = products.find(p => p.slug === slug) || products[0];
  
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || product.image);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Sizing Engine States
  const [isSizeWizardOpen, setIsSizeWizardOpen] = useState(false);
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [fitPref, setFitPref] = useState('Regular');
  const [recommendedSize, setRecommendedSize] = useState('');

  // Sync state if product changes (due to slug/navigation change)
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || product.image);
      setSelectedColor(product.colors?.[0]?.name || 'Default');
      setSelectedSize('');
      setQuantity(1);
      setRecommendedSize('');
    }
  }, [product]);

  const calculateSizing = (e) => {
    e.preventDefault();
    const w = Number(weight);
    if (w < 62) setRecommendedSize('S');
    else if (w < 74) setRecommendedSize('M');
    else if (w < 86) setRecommendedSize('L');
    else setRecommendedSize('XL');
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="text-[10px] uppercase tracking-widest text-brand-midgrey mb-8 flex items-center space-x-2">
        <Link to="/" className="hover:text-brand-black transition-luxury">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-black transition-luxury">Shop</Link>
        <span>/</span>
        <span className="text-brand-black font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: IMAGES GALLERY */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 sticky top-28">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-20 md:w-20 md:h-28 border overflow-hidden flex-shrink-0 transition-luxury ${selectedImage === img ? 'border-brand-black' : 'border-brand-lightgrey/30'}`}
              >
                <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Primary View */}
          <div className="flex-1 order-1 md:order-2 overflow-hidden aspect-[3/4] bg-brand-lightgrey/20 relative group">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {product.compareAtPrice && (
              <span className="absolute top-4 left-4 bg-brand-gold text-brand-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5">
                Limited Edition
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INFORMATION & ACCORDIONS */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div>
            <span className="text-[10px] text-brand-gold uppercase tracking-widest font-bold font-display">{product.category}</span>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-brand-black mt-2 font-display">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center text-brand-gold text-xs">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-current" />)}
                <span className="ml-1 text-brand-black/70 font-semibold">{product.rating} ({product.reviewCount || 28} verified buyers)</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 border-b border-brand-lightgrey/20 pb-4">
            <span className="text-xl font-bold text-brand-black">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-brand-midgrey line-through font-light">${product.compareAtPrice}</span>
            )}
          </div>

          <p className="text-xs text-brand-black/75 leading-relaxed font-sans font-light">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-3">Color: {selectedColor}</h3>
              <div className="flex space-x-3">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    style={{ backgroundColor: col.hex }}
                    className={`w-6 h-6 rounded-full border transition-luxury ${selectedColor === col.name ? 'ring-2 ring-brand-gold border-brand-white scale-110' : 'border-brand-lightgrey/60'}`}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector & Recommendation Link */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Size</h3>
                <button 
                  onClick={() => setIsSizeWizardOpen(true)}
                  className="text-[10px] text-brand-gold font-bold uppercase tracking-widest flex items-center hover:text-brand-black transition-luxury"
                >
                  <HelpCircle className="w-3.5 h-3.5 mr-1" />
                  <span>Find Your Size</span>
                </button>
              </div>
              <div className="flex gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border text-[10px] w-12 h-12 flex items-center justify-center font-bold tracking-wider transition-luxury ${selectedSize === size ? 'bg-brand-black text-brand-beige border-brand-black' : 'border-brand-lightgrey/40 hover:border-brand-black text-brand-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex gap-4 items-center border-t border-brand-lightgrey/20 pt-6">
            <div className="flex items-center border border-brand-lightgrey/40">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-3.5 hover:bg-brand-lightgrey/10 text-brand-black transition-luxury"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-4 text-xs font-bold text-brand-black font-sans">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-3.5 hover:bg-brand-lightgrey/10 text-brand-black transition-luxury"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-brand-beige hover:text-brand-black transition-luxury"
            >
              Add To Cart
            </button>
            
            <button 
              onClick={() => onAddToWishlist(product)}
              className="border border-brand-lightgrey/40 p-4 hover:border-brand-black transition-luxury text-brand-black"
              aria-label="Add to Wishlist"
            >
              <Heart className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Details Accordion / Tabs */}
          <div className="border-t border-brand-lightgrey/20 pt-8">
            <div className="flex border-b border-brand-lightgrey/20 text-[10px] font-bold uppercase tracking-widest text-brand-midgrey mb-4">
              <button 
                onClick={() => setActiveTab('description')} 
                className={`pb-2 pr-6 border-b-2 ${activeTab === 'description' ? 'border-brand-black text-brand-black' : 'border-transparent hover:text-brand-black'}`}
              >
                Fabrication
              </button>
              <button 
                onClick={() => setActiveTab('care')} 
                className={`pb-2 px-6 border-b-2 ${activeTab === 'care' ? 'border-brand-black text-brand-black' : 'border-transparent hover:text-brand-black'}`}
              >
                Care Instructions
              </button>
              <button 
                onClick={() => setActiveTab('shipping')} 
                className={`pb-2 pl-6 border-b-2 ${activeTab === 'shipping' ? 'border-brand-black text-brand-black' : 'border-transparent hover:text-brand-black'}`}
              >
                Shipping
              </button>
            </div>
            
            <div className="text-xs text-brand-black/75 leading-relaxed font-sans font-light min-h-[60px]">
              {activeTab === 'description' && product.fabricDetails}
              {activeTab === 'care' && product.careInstructions}
              {activeTab === 'shipping' && (
                <div className="space-y-2 text-[11px]">
                  <p className="flex items-center"><Truck className="w-4 h-4 mr-2 text-brand-gold stroke-[1.5]" /> Free standard worldwide express on orders over $150.</p>
                  <p className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 text-brand-gold stroke-[1.5]" /> Easy 30-day returns on unworn, tagged elements.</p>
                  <p className="flex items-center"><Shield className="w-4 h-4 mr-2 text-brand-gold stroke-[1.5]" /> Guaranteed authenticity and zero plastic recycled box packaging.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SIZE ENGINE recommendation modal */}
      {isSizeWizardOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm" onClick={() => setIsSizeWizardOpen(false)} />
          <div className="bg-brand-white max-w-md w-full p-8 relative z-10 border border-brand-lightgrey/30 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold uppercase tracking-widest text-brand-black font-display">Montclair Sizing Assistant</h2>
              <p className="text-[10px] text-brand-midgrey mt-1 font-sans">Provide metrics for your fit model estimation.</p>
            </div>
            
            <form onSubmit={calculateSizing} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-black block mb-1">Height (cm)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent text-brand-black"
                  required 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-black block mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent text-brand-black"
                  required 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-black block mb-1">Fit Preference</label>
                <select 
                  value={fitPref} 
                  onChange={(e) => setFitPref(e.target.value)} 
                  className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent text-brand-black"
                >
                  <option>Regular Fit</option>
                  <option>Slim Fit</option>
                  <option>Oversized Fit</option>
                </select>
              </div>
              
              <button type="submit" className="w-full bg-brand-black text-brand-beige text-[10px] font-bold uppercase tracking-widest py-3.5 hover:bg-brand-gold hover:text-brand-white transition-luxury">
                CALCULATE RECOMMENDATION
              </button>
            </form>

            {recommendedSize && (
              <div className="mt-6 border-t border-brand-lightgrey/20 pt-6 text-center">
                <span className="text-[10px] text-brand-midgrey uppercase tracking-widest block">Recommended size for you:</span>
                <span className="text-4xl font-extrabold text-brand-gold font-display mt-2 block">{recommendedSize}</span>
                <button 
                  onClick={() => { setSelectedSize(recommendedSize); setIsSizeWizardOpen(false); }}
                  className="mt-4 border border-brand-black text-brand-black text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 hover:bg-brand-black hover:text-brand-white transition-luxury"
                >
                  Apply size {recommendedSize}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
