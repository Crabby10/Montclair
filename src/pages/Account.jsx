import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Award, Share2, ShoppingBag, Settings, TrendingUp, Package, Users, Plus, Trash2, Check, ShieldAlert } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const Account = () => {
  // Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Form Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Sidebar Navigation
  const [activeTab, setActiveTab] = useState('profile');

  // Admin Section Child States
  const [adminTab, setAdminTab] = useState('analytics');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    category: 'jackets',
    image: '',
    sizes: 'S, M, L, XL',
    colors: 'Matte Black'
  });
  const [productAddError, setProductAddError] = useState('');

  // State arrays for local lists (sync with localStorage)
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [productsList, setProductsList] = useState([]);

  // Initialize DB in LocalStorage on Mount
  useEffect(() => {
    // 1. Seed users if not exists
    let localUsers = localStorage.getItem('montclair_users');
    let usersData = [];
    if (!localUsers) {
      usersData = [
        {
          firstName: 'Atelier',
          lastName: 'Admin',
          email: 'admin@montclair.com',
          password: 'admin123', // Clean text for mock auth simplicity
          role: 'admin',
          loyaltyTier: 'Elite',
          loyaltyPoints: 5000,
          referralCode: 'ADMINREF'
        },
        {
          firstName: 'Gentleman',
          lastName: 'User',
          email: 'gentleman@example.com',
          password: 'password123',
          role: 'user',
          loyaltyTier: 'Silver',
          loyaltyPoints: 1240,
          referralCode: 'MONT-GENT-01'
        }
      ];
      localStorage.setItem('montclair_users', JSON.stringify(usersData));
    } else {
      usersData = JSON.parse(localUsers);
    }
    setUsersList(usersData);

    // 2. Seed products if not exists
    let localProds = localStorage.getItem('montclair_products');
    let productsData = [];
    if (!localProds) {
      productsData = PRODUCTS;
      localStorage.setItem('montclair_products', JSON.stringify(productsData));
    } else {
      productsData = JSON.parse(localProds);
    }
    setProductsList(productsData);

    // 3. Seed orders if not exists
    let localOrders = localStorage.getItem('montclair_orders');
    let ordersData = [];
    if (!localOrders) {
      ordersData = [
        {
          id: 'ORD-A9028',
          date: '2026-06-12',
          user: 'gentleman@example.com',
          userName: 'Gentleman User',
          items: [
            { name: 'Merino Wool Knit Blazer', price: 289, quantity: 1, size: 'M', color: 'Matte Black' }
          ],
          subTotal: 289,
          discountAmount: 0,
          shippingFee: 0,
          totalAmount: 289,
          status: 'Delivered',
          shippingAddress: { street: '10 Atelier Drive', city: 'Milan', state: 'Lombardy', postalCode: '20121', country: 'Italy' },
          paymentDetails: { gateway: 'stripe', transactionId: 'TXN_MOCK8731', status: 'paid' }
        },
        {
          id: 'ORD-B3821',
          date: '2026-05-30',
          user: 'gentleman@example.com',
          userName: 'Gentleman User',
          items: [
            { name: 'Pima Cotton Oversized Tee', price: 65, quantity: 2, size: 'L', color: 'Warm Beige' }
          ],
          subTotal: 130,
          discountAmount: 0,
          shippingFee: 15,
          totalAmount: 145,
          status: 'Shipped',
          carrierName: 'DHL Express',
          trackingNumber: 'JD102837199',
          shippingAddress: { street: '45 Savile Row', city: 'London', state: 'England', postalCode: 'W1S 3PG', country: 'United Kingdom' },
          paymentDetails: { gateway: 'stripe', transactionId: 'TXN_MOCK1928', status: 'paid' }
        }
      ];
      localStorage.setItem('montclair_orders', JSON.stringify(ordersData));
    } else {
      ordersData = JSON.parse(localOrders);
    }
    setOrdersList(ordersData);

    // 4. Check if there is an active session
    let sessionUser = localStorage.getItem('montclair_active_user');
    if (sessionUser) {
      const parsedUser = JSON.parse(sessionUser);
      setIsLoggedIn(true);
      setActiveUser(parsedUser);
    }
  }, []);

  // Handle Authentication submit
  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');

    if (mode === 'login') {
      const matchedUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matchedUser && matchedUser.password === password) {
        localStorage.setItem('montclair_active_user', JSON.stringify(matchedUser));
        setActiveUser(matchedUser);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
      } else {
        setAuthError('INVALID EMAIL OR PASSWORD. PLEASE CHECK YOUR DETAILS.');
      }
    } else {
      // Register Mode
      const userExists = usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setAuthError('AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS.');
        return;
      }

      const generatedReferralCode = 'MONT-' + firstName.substring(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        role: 'user',
        loyaltyTier: 'Silver',
        loyaltyPoints: 0,
        referralCode: generatedReferralCode
      };

      const updatedUsersList = [...usersList, newUser];
      localStorage.setItem('montclair_users', JSON.stringify(updatedUsersList));
      setUsersList(updatedUsersList);

      localStorage.setItem('montclair_active_user', JSON.stringify(newUser));
      setActiveUser(newUser);
      setIsLoggedIn(true);
      
      // Reset fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('montclair_active_user');
    setActiveUser(null);
    setIsLoggedIn(false);
    setActiveTab('profile');
  };

  // Get orders specifically for logged in user
  const getUserOrders = () => {
    if (!activeUser) return [];
    return ordersList.filter(o => o.user.toLowerCase() === activeUser.email.toLowerCase());
  };

  // ADMIN OPERATIONS
  // 1. Toggle user role (promote/demote admin)
  const toggleUserRole = (userEmail) => {
    const updatedUsers = usersList.map(u => {
      if (u.email === userEmail) {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: newRole };
      }
      return u;
    });
    localStorage.setItem('montclair_users', JSON.stringify(updatedUsers));
    setUsersList(updatedUsers);

    // If active user updated themselves
    if (activeUser && activeUser.email === userEmail) {
      const self = updatedUsers.find(u => u.email === userEmail);
      localStorage.setItem('montclair_active_user', JSON.stringify(self));
      setActiveUser(self);
    }
  };

  // 2. Delete product
  const deleteProduct = (prodId) => {
    const updatedProducts = productsList.filter(p => p.id !== prodId && p._id !== prodId);
    localStorage.setItem('montclair_products', JSON.stringify(updatedProducts));
    setProductsList(updatedProducts);
  };

  // 3. Add new product
  const handleAddProduct = (e) => {
    e.preventDefault();
    setProductAddError('');

    const slugExists = productsList.some(p => p.slug === newProduct.slug);
    if (slugExists) {
      setProductAddError('PRODUCT WITH THIS SLUG ALREADY EXISTS.');
      return;
    }

    const sizesArr = newProduct.sizes.split(',').map(s => s.trim());
    const colorsArr = newProduct.colors.split(',').map(c => c.trim());

    // Create a detailed product object matching structure
    const createdProduct = {
      id: Date.now(),
      _id: 'mock_prod_' + Math.random().toString(36).substring(2, 9),
      name: newProduct.name,
      slug: newProduct.slug,
      description: newProduct.description,
      shortDescription: newProduct.shortDescription || newProduct.description.substring(0, 50) + '...',
      price: Number(newProduct.price),
      compareAtPrice: newProduct.compareAtPrice ? Number(newProduct.compareAtPrice) : null,
      images: [newProduct.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500'],
      category: newProduct.category,
      collectionTag: 'Winter Drop',
      sizes: sizesArr,
      colors: colorsArr.map(colName => ({ name: colName, hex: colName.toLowerCase() === 'black' ? '#0A0A0A' : '#D6C5A4' })),
      skus: sizesArr.map((size, idx) => ({
        size,
        color: colorsArr[0] || 'Default',
        stock: 50,
        sku: `MONT-${newProduct.slug.substring(0, 3).toUpperCase()}-${size}-${idx}`
      })),
      rating: 5,
      reviewCount: 0,
      fabricDetails: '100% fine cotton or organic wool. Soft and breathable draping.',
      careInstructions: 'Dry clean recommended or machine wash cold delicate.'
    };

    const updatedProds = [createdProduct, ...productsList];
    localStorage.setItem('montclair_products', JSON.stringify(updatedProds));
    setProductsList(updatedProds);

    // Reset Form
    setNewProduct({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: '',
      compareAtPrice: '',
      category: 'jackets',
      image: '',
      sizes: 'S, M, L, XL',
      colors: 'Matte Black'
    });
    setShowAddProduct(false);
    alert('Product successfully added to catalog!');
  };

  // 4. Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = ordersList.map(o => {
      if (o.id === orderId) {
        let trackingDetails = {};
        if (newStatus === 'Shipped') {
          trackingDetails = {
            carrierName: 'FedEx Express',
            trackingNumber: 'FTX' + Math.floor(100000 + Math.random() * 900000)
          };
        }
        return { ...o, status: newStatus, ...trackingDetails };
      }
      return o;
    });
    localStorage.setItem('montclair_orders', JSON.stringify(updatedOrders));
    setOrdersList(updatedOrders);
  };

  // Compute analytics
  const totalRevenue = ordersList.reduce((acc, o) => acc + o.totalAmount, 0);
  const averageOrderValue = ordersList.length > 0 ? Math.round(totalRevenue / ordersList.length) : 0;

  // Unsplash Mock image defaults for quick selectors
  const defaultProductAssets = [
    { name: 'Blazer/Coat', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600' },
    { name: 'Oversized Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600' },
    { name: 'Linen Shirt', url: 'https://images.unsplash.com/photo-1620012253295-c05518e99309?auto=format&fit=crop&q=80&w=600' }
  ];

  // AUTH STATE RENDERING (Not Logged In)
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-6">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-brand-black font-display">
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h1>
          <p className="text-[10px] text-brand-midgrey mt-2.5 uppercase tracking-widest font-sans">
            {mode === 'login' ? 'Access your luxury concierge dashboard' : 'Join the Montclair society of gentlemen'}
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 text-red-700 p-4 border-l-2 border-red-500 text-[10px] tracking-wide uppercase font-bold mb-6">
            ✕ {authError}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-black block mb-1">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-gold uppercase tracking-wider font-sans bg-transparent text-brand-black" 
                  required 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-black block mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-gold uppercase tracking-wider font-sans bg-transparent text-brand-black" 
                  required 
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-black block mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. gentleman@example.com"
              className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-gold tracking-wider font-sans bg-transparent text-brand-black" 
              required 
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-black block mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-gold tracking-wider font-sans bg-transparent text-brand-black" 
              required 
            />
          </div>

          <button type="submit" className="w-full bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-brand-beige hover:text-brand-black transition-luxury cursor-pointer">
            {mode === 'login' ? 'LOG IN' : 'REGISTER'}
          </button>
        </form>

        <div className="text-center mt-8 space-y-3">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[10px] text-brand-gold font-bold uppercase tracking-widest hover:text-brand-black transition-luxury"
          >
            {mode === 'login' ? 'Create an executive account' : 'Already have an account? Sign in'}
          </button>
          
          {mode === 'login' && (
            <div className="border-t border-brand-lightgrey/30 pt-6 mt-6 text-left">
              <span className="text-[9px] uppercase tracking-widest font-bold text-brand-midgrey block mb-2">Demo Credentials:</span>
              <div className="flex justify-between text-[10px] text-brand-black font-sans leading-relaxed">
                <div>
                  <strong>Admin:</strong> admin@montclair.com <br />
                  <strong>Pass:</strong> admin123
                </div>
                <div>
                  <strong>User:</strong> gentleman@example.com <br />
                  <strong>Pass:</strong> password123
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LOGGED IN STATE RENDERING
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Banner */}
      <div className="border-b border-brand-lightgrey/30 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider font-display text-brand-black">
            Welcome, {activeUser.firstName} {activeUser.lastName}
          </h1>
          <span className="text-[10px] text-brand-midgrey uppercase tracking-wider mt-1 block">
            Membership Status: <strong className="text-brand-gold font-bold">{activeUser.role === 'admin' ? 'Atelier Director (Admin)' : `${activeUser.loyaltyTier} Tier Client`}</strong>
          </span>
        </div>
        <button onClick={handleLogout} className="text-[9px] font-bold uppercase tracking-widest text-brand-midgrey hover:text-brand-black border border-brand-lightgrey/40 px-5 py-2.5 transition-luxury cursor-pointer">
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1.5">
          {[
            { id: 'profile', label: 'Executive Dashboard', icon: User, show: true },
            { id: 'orders', label: 'Order History', icon: ShoppingBag, show: true },
            { id: 'loyalty', label: 'Loyalty Tiers', icon: Award, show: true },
            { id: 'referral', label: 'Refer a Gentleman', icon: Share2, show: true },
            { id: 'admin', label: 'Atelier Admin Panel', icon: Settings, show: activeUser.role === 'admin' }
          ].map(tab => {
            if (!tab.show) return null;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id === 'admin') setAdminTab('analytics'); }}
                className={`w-full text-left flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider transition-luxury border-l-2 ${activeTab === tab.id ? 'border-brand-black bg-brand-lightgrey/10 font-bold text-brand-black' : 'border-transparent text-brand-midgrey hover:text-brand-black'}`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Dynamic Display Panel */}
        <main className="lg:col-span-9 border border-brand-lightgrey/30 p-6 sm:p-8 min-h-[400px] bg-brand-white/45">
          
          {/* PROFILE DASHBOARD */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="border-b border-brand-lightgrey/20 pb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black">Atelier Dashboard</h2>
                <p className="text-[10px] text-brand-midgrey mt-1 font-sans">Overview of your quiet luxury membership profile details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                <div className="bg-brand-lightgrey/10 p-5 border border-brand-lightgrey/20 rounded-sm">
                  <span className="text-brand-midgrey text-[9px] uppercase tracking-wider block mb-1">Registered Email</span>
                  <span className="font-semibold text-brand-black">{activeUser.email}</span>
                </div>
                <div className="bg-brand-lightgrey/10 p-5 border border-brand-lightgrey/20 rounded-sm">
                  <span className="text-brand-midgrey text-[9px] uppercase tracking-wider block mb-1">Loyalty Tier Status</span>
                  <span className="font-semibold text-brand-gold uppercase tracking-wider">{activeUser.loyaltyTier || 'Silver'} Level</span>
                </div>
                <div className="bg-brand-lightgrey/10 p-5 border border-brand-lightgrey/20 rounded-sm">
                  <span className="text-brand-midgrey text-[9px] uppercase tracking-wider block mb-1">Loyalty Points Accumulated</span>
                  <span className="font-semibold text-brand-black">{activeUser.loyaltyPoints || 0} pts</span>
                </div>
                <div className="bg-brand-lightgrey/10 p-5 border border-brand-lightgrey/20 rounded-sm">
                  <span className="text-brand-midgrey text-[9px] uppercase tracking-wider block mb-1">Concerige Referral Code</span>
                  <span className="font-semibold text-brand-gold tracking-widest uppercase">{activeUser.referralCode}</span>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="border-b border-brand-lightgrey/20 pb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black">Your Order History</h2>
                <p className="text-[10px] text-brand-midgrey mt-1 font-sans">Track and inspect current shipments and transaction logs.</p>
              </div>

              {getUserOrders().length === 0 ? (
                <div className="text-center py-12 border border-dashed border-brand-lightgrey/30">
                  <p className="text-xs text-brand-midgrey uppercase tracking-wider">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="mt-4 inline-block bg-brand-black text-brand-beige text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-brand-gold transition-luxury">
                    SHOP THE CATALOG
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUserOrders().map(order => (
                    <div key={order.id} className="border border-brand-lightgrey/25 p-5 space-y-4 bg-brand-lightgrey/5">
                      <div className="flex justify-between items-center flex-wrap gap-2 text-[10px] uppercase font-bold border-b border-brand-lightgrey/10 pb-3">
                        <div className="flex gap-4">
                          <span>Order ID: <span className="text-brand-black">{order.id}</span></span>
                          <span className="text-brand-midgrey">{order.date}</span>
                        </div>
                        <div>
                          <span className={`px-2.5 py-1 text-[8px] tracking-wider uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-brand-beige/35 text-brand-black'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-sans">
                            <div className="text-brand-black/75">
                              <span>{item.name}</span>
                              <span className="text-[10px] text-brand-midgrey ml-2">({item.size} / {item.color}) × {item.quantity}</span>
                            </div>
                            <span className="font-semibold text-brand-black">${item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="flex justify-between items-baseline text-xs pt-2 border-t border-brand-lightgrey/10">
                        <div className="text-[10px] text-brand-midgrey font-light">
                          {order.carrierName && (
                            <span>Shipped via: <strong>{order.carrierName}</strong> (Tracking: {order.trackingNumber})</span>
                          )}
                        </div>
                        <span className="text-brand-black font-semibold">Total Paid: <strong className="text-sm font-bold">${order.totalAmount}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LOYALTY TIERS */}
          {activeTab === 'loyalty' && (
            <div className="space-y-8">
              <div className="border-b border-brand-lightgrey/20 pb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black">Montclair Privilege Club</h2>
                <p className="text-[10px] text-brand-midgrey mt-1 font-sans">Your rewards balance, membership status, and client tier incentives.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="border border-brand-lightgrey/30 p-5 bg-brand-lightgrey/5">
                  <span className="text-[9px] text-brand-midgrey block uppercase tracking-wider">Points Balance</span>
                  <span className="text-3xl font-bold text-brand-black mt-1.5 block font-display">{activeUser.loyaltyPoints || 0}</span>
                </div>
                <div className="border border-brand-lightgrey/30 p-5 bg-brand-lightgrey/5">
                  <span className="text-[9px] text-brand-midgrey block uppercase tracking-wider">Active Tier</span>
                  <span className="text-3xl font-bold text-brand-gold mt-1.5 block uppercase font-display">{activeUser.loyaltyTier || 'Silver'}</span>
                </div>
                <div className="border border-brand-lightgrey/30 p-5 bg-brand-lightgrey/5">
                  <span className="text-[9px] text-brand-midgrey block uppercase tracking-wider">Next Tier Target</span>
                  <span className="text-base font-bold text-brand-black/60 mt-2 block font-display">
                    {activeUser.loyaltyTier === 'Elite' ? 'Maximum Tier' : 'Gold Level (2000)'}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-black">Tier Perks Breakdown</h3>
                <div className="space-y-3 font-sans text-xs text-brand-black/75">
                  <div className="border-l-2 border-brand-beige pl-4 py-1">
                    <strong className="text-brand-gold uppercase tracking-wider font-bold">Silver Tier (Active Entry)</strong>
                    <p className="text-[10px] text-brand-midgrey mt-0.5">Collect 1 points for every $1 spent. Complimentary gift box options and standard 30 days return window.</p>
                  </div>
                  <div className="border-l-2 border-brand-midgrey pl-4 py-1">
                    <strong className="text-brand-black uppercase tracking-wider font-bold">Gold Tier (From 2000 points)</strong>
                    <p className="text-[10px] text-brand-midgrey mt-0.5">Collect 1.5 points for every $1 spent. Automatic upgrade to free Worldwide Express courier shipping and private preview invitations.</p>
                  </div>
                  <div className="border-l-2 border-brand-gold pl-4 py-1">
                    <strong className="text-brand-gold uppercase tracking-wider font-bold">Elite Tier (From 5000 points)</strong>
                    <p className="text-[10px] text-brand-midgrey mt-0.5">Collect 2 points for every $1 spent. Live dedicated stylist advisor access, lifetime free express delivery, and invitations to custom fittings.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REFERRAL SYSTEM */}
          {activeTab === 'referral' && (
            <div className="space-y-6">
              <div className="border-b border-brand-lightgrey/20 pb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black">Refer A Gentleman</h2>
                <p className="text-[10px] text-brand-midgrey mt-1 font-sans">Share quiet luxury and earn concierge incentives.</p>
              </div>

              <p className="text-xs text-brand-black/75 leading-relaxed font-sans font-light">
                Share your personal code with friends. They will receive $20 off their initial Montclair capsule purchases, and we will credit your wallet with $20 in brand cash credits when they place their first order.
              </p>
              
              <div className="border border-dashed border-brand-gold/40 p-8 text-center space-y-4 bg-brand-lightgrey/5">
                <span className="text-[10px] text-brand-midgrey block uppercase tracking-widest font-semibold">Your Referral Identifier Code</span>
                <span className="text-xl font-bold text-brand-gold tracking-widest uppercase block font-display">{activeUser.referralCode}</span>
                <button 
                  onClick={() => { navigator.clipboard.writeText(activeUser.referralCode); alert('Referral code copied to clipboard!'); }}
                  className="bg-brand-black text-brand-white text-[10px] font-bold uppercase tracking-widest px-8 py-3.5 hover:bg-brand-beige hover:text-brand-black transition-luxury cursor-pointer"
                >
                  COPY CODE TO CLIPBOARD
                </button>
              </div>
            </div>
          )}

          {/* ATELIER ADMIN PANEL */}
          {activeTab === 'admin' && activeUser.role === 'admin' && (
            <div className="space-y-8">
              {/* Header admin section */}
              <div className="border-b border-brand-lightgrey/30 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gold flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" /> ATELIER ADMINISTRATIVE CONTROL
                  </h2>
                  <p className="text-[9px] text-brand-midgrey mt-1 font-sans">Manage collections, review orders, and monitor client directories.</p>
                </div>
                
                {/* Admin Subtabs */}
                <div className="flex gap-4 text-[9px] font-bold uppercase tracking-wider text-brand-midgrey mt-2 sm:mt-0">
                  <button 
                    onClick={() => setAdminTab('analytics')}
                    className={`pb-1 border-b ${adminTab === 'analytics' ? 'border-brand-gold text-brand-gold' : 'border-transparent hover:text-brand-black'}`}
                  >
                    Analytics
                  </button>
                  <button 
                    onClick={() => setAdminTab('orders')}
                    className={`pb-1 border-b ${adminTab === 'orders' ? 'border-brand-gold text-brand-gold' : 'border-transparent hover:text-brand-black'}`}
                  >
                    Orders ({ordersList.length})
                  </button>
                  <button 
                    onClick={() => setAdminTab('products')}
                    className={`pb-1 border-b ${adminTab === 'products' ? 'border-brand-gold text-brand-gold' : 'border-transparent hover:text-brand-black'}`}
                  >
                    Catalog ({productsList.length})
                  </button>
                  <button 
                    onClick={() => setAdminTab('users')}
                    className={`pb-1 border-b ${adminTab === 'users' ? 'border-brand-gold text-brand-gold' : 'border-transparent hover:text-brand-black'}`}
                  >
                    Clients ({usersList.length})
                  </button>
                </div>
              </div>

              {/* ADMIN SUBTAB CONTROLLER */}
              {/* 1. ANALYTICS */}
              {adminTab === 'analytics' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-brand-lightgrey/30 p-5 bg-brand-lightgrey/5 rounded-sm">
                      <div className="flex justify-between items-center text-brand-midgrey">
                        <span className="text-[9px] uppercase tracking-wider">Total Sales</span>
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xl font-bold text-brand-black mt-2 block font-display">${totalRevenue}</span>
                    </div>

                    <div className="border border-brand-lightgrey/30 p-5 bg-brand-lightgrey/5 rounded-sm">
                      <div className="flex justify-between items-center text-brand-midgrey">
                        <span className="text-[9px] uppercase tracking-wider">Total Orders</span>
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xl font-bold text-brand-black mt-2 block font-display">{ordersList.length}</span>
                    </div>

                    <div className="border border-brand-lightgrey/30 p-5 bg-brand-lightgrey/5 rounded-sm">
                      <div className="flex justify-between items-center text-brand-midgrey">
                        <span className="text-[9px] uppercase tracking-wider">Avg Order Value</span>
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xl font-bold text-brand-black mt-2 block font-display">${averageOrderValue}</span>
                    </div>

                    <div className="border border-brand-lightgrey/30 p-5 bg-brand-lightgrey/5 rounded-sm">
                      <div className="flex justify-between items-center text-brand-midgrey">
                        <span className="text-[9px] uppercase tracking-wider">Registered Clients</span>
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xl font-bold text-brand-black mt-2 block font-display">{usersList.length}</span>
                    </div>
                  </div>

                  {/* Quick Recent order list */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-brand-black">Live Operational Status</h3>
                    <div className="bg-brand-lightgrey/10 border border-brand-lightgrey/25 p-4 rounded-sm text-xs font-sans text-brand-black/75 space-y-2">
                      <p>● Connected to local frontend data engine (Local Storage persistent).</p>
                      <p>● Direct inventory linking active (Purchases deduct sizes stock dynamically).</p>
                      <p>● API endpoints matching backend templates at `/api/auth` and `/api/products` configured.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ORDERS */}
              {adminTab === 'orders' && (
                <div className="space-y-6">
                  {ordersList.length === 0 ? (
                    <p className="text-xs text-brand-midgrey uppercase tracking-wider text-center py-6">No orders registered in the system yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead>
                          <tr className="border-b border-brand-lightgrey/30 text-[9px] uppercase tracking-wider text-brand-midgrey">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Client</th>
                            <th className="pb-3">Items</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordersList.map(order => (
                            <tr key={order.id} className="border-b border-brand-lightgrey/10 hover:bg-brand-lightgrey/5">
                              <td className="py-4 font-semibold text-brand-black">{order.id}</td>
                              <td className="py-4">
                                <span className="font-semibold block">{order.userName}</span>
                                <span className="text-[10px] text-brand-midgrey block">{order.user}</span>
                              </td>
                              <td className="py-4">
                                <div className="space-y-0.5 text-[10px]">
                                  {order.items.map((it, idx) => (
                                    <div key={idx}>
                                      {it.name} <span className="text-brand-midgrey font-light">({it.size}/{it.color}) × {it.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 font-bold text-brand-black">${order.totalAmount}</td>
                              <td className="py-4">
                                <span className={`px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-brand-beige/35 text-brand-black'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  {order.status === 'Processing' && (
                                    <button 
                                      onClick={() => updateOrderStatus(order.id, 'Shipped')}
                                      className="bg-brand-black text-brand-white text-[8px] font-bold uppercase tracking-wider px-2.5 py-1.5 hover:bg-brand-gold transition-luxury cursor-pointer"
                                    >
                                      Mark Shipped
                                    </button>
                                  )}
                                  {order.status === 'Shipped' && (
                                    <button 
                                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                      className="bg-green-700 text-brand-white text-[8px] font-bold uppercase tracking-wider px-2.5 py-1.5 hover:bg-green-800 transition-luxury cursor-pointer"
                                    >
                                      Mark Delivered
                                    </button>
                                  )}
                                  <span className="text-[10px] text-brand-midgrey">
                                    {order.status === 'Delivered' && 'Completed'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 3. PRODUCTS CATALOG */}
              {adminTab === 'products' && (
                <div className="space-y-6">
                  {/* Toggle button */}
                  <div className="flex justify-between items-center pb-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-brand-black">Catalog Products list</h3>
                    <button 
                      onClick={() => setShowAddProduct(!showAddProduct)}
                      className="bg-brand-black text-brand-white text-[9px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-brand-gold transition-luxury flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddProduct ? 'CLOSE FORM' : 'ADD NEW PRODUCT'}</span>
                    </button>
                  </div>

                  {/* Add Product Form */}
                  {showAddProduct && (
                    <form onSubmit={handleAddProduct} className="border border-brand-gold/30 p-5 bg-brand-lightgrey/5 space-y-4 rounded-sm text-brand-black">
                      <div className="border-b border-brand-lightgrey/20 pb-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">Create Product Silhouette</h4>
                        {productAddError && <p className="text-[9px] text-red-600 mt-1 uppercase">✕ {productAddError}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider block mb-1">Product Name</label>
                          <input 
                            type="text" 
                            value={newProduct.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              setNewProduct({ ...newProduct, name, slug });
                            }}
                            placeholder="e.g. Italian Silk Summer Shirt"
                            className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider block mb-1">Product URL Slug</label>
                          <input 
                            type="text" 
                            value={newProduct.slug}
                            onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                            className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none tracking-wider font-sans bg-brand-white text-brand-black" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider block mb-1">Category</label>
                          <select 
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black"
                          >
                            <option value="blazers">blazers</option>
                            <option value="jackets">jackets</option>
                            <option value="t-shirts">t-shirts</option>
                            <option value="shirts">shirts</option>
                            <option value="trousers">trousers</option>
                            <option value="hoodies">hoodies</option>
                            <option value="polos">polos</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-bold tracking-wider block mb-1">Price ($)</label>
                            <input 
                              type="number" 
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                              className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none font-sans bg-brand-white text-brand-black" 
                              required 
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-bold tracking-wider block mb-1">Compare Price ($)</label>
                            <input 
                              type="number" 
                              value={newProduct.compareAtPrice}
                              onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
                              className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none font-sans bg-brand-white text-brand-black" 
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] uppercase font-bold tracking-wider block mb-1">Description</label>
                        <textarea 
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          rows="3"
                          placeholder="Meticulously crafted structural detailing description..."
                          className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none font-sans bg-brand-white text-brand-black" 
                          required 
                        />
                      </div>

                      {/* Image URLs Selectors */}
                      <div>
                        <div className="flex justify-between items-baseline mb-1">
                          <label className="text-[9px] uppercase font-bold tracking-wider block">Image Asset URL</label>
                          <span className="text-[8px] text-brand-midgrey">Select premium Unsplash placeholder or enter URL</span>
                        </div>
                        <input 
                          type="text" 
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none font-sans bg-brand-white text-brand-black mb-2" 
                          required 
                        />
                        <div className="flex gap-2">
                          {defaultProductAssets.map((asset, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setNewProduct({ ...newProduct, image: asset.url })}
                              className="border border-brand-lightgrey/30 bg-brand-white hover:border-brand-gold text-[8px] tracking-wide uppercase px-2 py-1 flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Use {asset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sizes and Colors configs */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider block mb-1">Sizes (Comma separated)</label>
                          <input 
                            type="text" 
                            value={newProduct.sizes}
                            onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                            className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase font-bold tracking-wider block mb-1">Colors (Comma separated)</label>
                          <input 
                            type="text" 
                            value={newProduct.colors}
                            onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                            className="w-full border border-brand-lightgrey/40 px-3 py-1.5 text-xs focus:outline-none uppercase tracking-wider font-sans bg-brand-white text-brand-black" 
                            required 
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-brand-gold text-brand-white text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-brand-black transition-luxury cursor-pointer">
                        PUBLISH NEW SILHOUETTE
                      </button>
                    </form>
                  )}

                  {/* Catalog list */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans border-collapse">
                      <thead>
                        <tr className="border-b border-brand-lightgrey/30 text-[9px] uppercase tracking-wider text-brand-midgrey">
                          <th className="pb-3">Asset</th>
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Sizes</th>
                          <th className="pb-3 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsList.map(prod => (
                          <tr key={prod.id} className="border-b border-brand-lightgrey/10 hover:bg-brand-lightgrey/5">
                            <td className="py-3">
                              <img src={prod.images?.[0] || prod.image} alt={prod.name} className="w-10 h-12 object-cover bg-brand-lightgrey/20" />
                            </td>
                            <td className="py-3 font-semibold text-brand-black">
                              <Link to={`/product/${prod.slug}`} className="hover:text-brand-gold">{prod.name}</Link>
                            </td>
                            <td className="py-3 uppercase text-[10px] text-brand-midgrey">{prod.category}</td>
                            <td className="py-3 font-semibold text-brand-black">${prod.price}</td>
                            <td className="py-3 text-[10px] text-brand-midgrey">{prod.sizes?.join(', ')}</td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => deleteProduct(prod.id || prod._id)}
                                className="text-red-600 hover:text-red-800 transition-luxury p-1 cursor-pointer"
                                aria-label="Delete product"
                              >
                                <Trash2 className="w-4 h-4 stroke-[1.5]" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. CLIENTS MANAGER */}
              {adminTab === 'users' && (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans border-collapse">
                      <thead>
                        <tr className="border-b border-brand-lightgrey/30 text-[9px] uppercase tracking-wider text-brand-midgrey">
                          <th className="pb-3">Client Name</th>
                          <th className="pb-3">Email Address</th>
                          <th className="pb-3">Privilege Level</th>
                          <th className="pb-3">Accumulated Points</th>
                          <th className="pb-3 text-right">Toggle Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map(client => (
                          <tr key={client.email} className="border-b border-brand-lightgrey/10 hover:bg-brand-lightgrey/5">
                            <td className="py-4 font-semibold text-brand-black">{client.firstName} {client.lastName}</td>
                            <td className="py-4 text-brand-black/75">{client.email}</td>
                            <td className="py-4">
                              <span className={`px-2.5 py-0.5 text-[8px] font-bold tracking-wider uppercase ${client.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-brand-lightgrey/50 text-brand-midgrey'}`}>
                                {client.role === 'admin' ? 'Atelier Admin' : 'Customer'}
                              </span>
                            </td>
                            <td className="py-4 font-semibold text-brand-black">{client.loyaltyPoints || 0} pts</td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => toggleUserRole(client.email)}
                                className={`text-[8px] font-bold uppercase tracking-wider px-2 py-1 border transition-luxury cursor-pointer ${client.role === 'admin' ? 'border-red-400 text-red-500 hover:bg-red-50' : 'border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-white'}`}
                              >
                                {client.role === 'admin' ? 'Demote Client' : 'Promote Admin'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Account;
