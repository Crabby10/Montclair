import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Marquee from './components/common/Marquee';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Blog from './pages/Blog';
import Wishlist from './pages/Wishlist';

// Accessibility / Auxiliary Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ShippingReturns from './pages/ShippingReturns';
import SizeGuide from './pages/SizeGuide';
import OrderTracking from './pages/OrderTracking';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Sitemap from './pages/Sitemap';

import WhatsAppWidget from './components/widgets/WhatsAppWidget';

// Actions
import { addToCart, removeFromCart, updateCartQuantity } from './redux/slices/cartSlice';
import { toggleWishlist, removeFromWishlist } from './redux/slices/wishlistSlice';

function App() {
  const dispatch = useDispatch();
  
  // Redux Selectors
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`Added ${product.name} (Size: ${product.size || 'M'}) to your cart.`);
  };

  const handleAddToWishlist = (product) => {
    dispatch(toggleWishlist(product));
    alert(`Wishlist status toggled for ${product.name}.`);
  };

  const handleUpdateQuantity = (idx, qty) => {
    dispatch(updateCartQuantity({ idx, quantity: qty }));
  };

  const handleRemoveCartItem = (idx) => {
    dispatch(removeFromCart(idx));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-brand-white text-brand-black">
        {/* Global Announcement Marquee */}
        <Marquee />

        {/* Global Navigation Header */}
        <Header 
          cartCount={cartCount} 
          wishlistCount={wishlistItems.length}
          onCartClick={() => window.location.href = '/cart'}
        />

        {/* Routing Body */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onAddToCart={(p) => handleAddToCart({ ...p, size: 'M', color: 'Matte Black' })} />} />
            <Route path="/shop" element={<Shop onAddToCart={(p) => handleAddToCart({ ...p, size: 'M', color: 'Matte Black' })} />} />
            <Route path="/new-arrivals" element={
              <Shop 
                onAddToCart={(p) => handleAddToCart({ ...p, size: 'M', color: 'Matte Black' })} 
                title="New Arrivals" 
                subtitle="The latest drops and contemporary silhouettes, fresh from our atelier."
                defaultSort="newest"
              />
            } />
            <Route path="/best-sellers" element={
              <Shop 
                onAddToCart={(p) => handleAddToCart({ ...p, size: 'M', color: 'Matte Black' })} 
                title="Best Sellers" 
                subtitle="Our most coveted quiet luxury elements, highly rated by modern gentlemen."
                defaultSort="rating"
              />
            } />
            <Route path="/collections" element={
              <Shop 
                onAddToCart={(p) => handleAddToCart({ ...p, size: 'M', color: 'Matte Black' })} 
                title="Capsule Collections" 
                subtitle="Curated aesthetic capsules designed for specific climates and occasions. Filter by collection to explore our drops."
              />
            } />
            <Route path="/product/:slug" element={<ProductDetail onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveCartItem} />} />
            <Route path="/account" element={<Account />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/wishlist" element={<Wishlist wishlistItems={wishlistItems} onRemoveFromWishlist={(id) => dispatch(removeFromWishlist(id))} onMoveToCart={handleAddToCart} />} />
            
            {/* Aux / Access Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/sitemap" element={<Sitemap />} />
            
            {/* Fallbacks */}
            <Route path="*" element={<Home onAddToCart={(p) => handleAddToCart({ ...p, size: 'M', color: 'Matte Black' })} />} />
          </Routes>
        </main>

        {/* Global Brand Footer */}
        <Footer />

        {/* Floating Concierge WhatsApp support */}
        <WhatsAppWidget />
      </div>
    </Router>
  );
}

export default App;
