import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';

const Wishlist = ({ wishlistItems = [], onRemoveFromWishlist, onMoveToCart }) => {
  
  const handleMoveToCart = (item) => {
    onMoveToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: 'M', // default size
      color: 'Matte Black', // default color
      quantity: 1
    });
    onRemoveFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <Heart className="w-12 h-12 text-brand-beige mx-auto mb-6 stroke-[1.5]" />
        <h1 className="text-xl font-bold uppercase tracking-widest text-brand-black font-display">Your Wishlist is Empty</h1>
        <p className="text-xs text-brand-midgrey mt-2 font-sans">You haven't saved any quiet luxury items to your wishlist yet.</p>
        <Link to="/shop" className="mt-8 inline-block bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-brand-beige hover:text-brand-black transition-luxury">
          EXPLORE COLLECTIONS
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-brand-lightgrey/30 pb-8 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-wider font-display text-brand-black">Your Wishlist</h1>
        <p className="text-xs text-brand-midgrey mt-2 tracking-wide font-sans">
          Saved garments reserved for your next capsule selection.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group flex flex-col border border-brand-lightgrey/30 p-4 relative">
            
            {/* Delete button from wishlist */}
            <button 
              onClick={() => onRemoveFromWishlist(item.id)}
              className="absolute top-6 right-6 z-10 bg-brand-white/80 p-2 text-brand-midgrey hover:text-brand-black transition-luxury shadow-sm rounded-full"
              aria-label="Remove from Wishlist"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Product Image */}
            <div className="relative overflow-hidden aspect-[3/4] bg-brand-lightgrey/20">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>

            {/* Product Details */}
            <div className="mt-4 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-brand-black font-display">
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </h3>
                <span className="text-xs font-bold text-brand-black/85 font-sans mt-2 block">${item.price}</span>
              </div>

              {/* Move to Cart action */}
              <button
                onClick={() => handleMoveToCart(item)}
                className="w-full bg-brand-black text-brand-white text-[10px] font-bold uppercase tracking-widest py-3 mt-4 flex items-center justify-center space-x-1.5 hover:bg-brand-beige hover:text-brand-black transition-luxury"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
