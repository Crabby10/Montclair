import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, SlidersHorizontal, ShoppingBag, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const Shop = ({ 
  onAddToCart, 
  title = 'Shop All', 
  subtitle = 'Browse our collection of structural drapes, tailoring elements, and casual necessities.', 
  defaultSort = 'newest', 
  defaultCollection = '' 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products] = useState(() => {
    const local = localStorage.getItem('montclair_products');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const hasOldTrouserJacket = parsed.some(p => p.slug === 'minimalist-waterproof-shell-jacket' && p.images && p.images[0].includes('photo-1548883354-7622d03aca27'));
        if (hasOldTrouserJacket) {
          localStorage.setItem('montclair_products', JSON.stringify(PRODUCTS));
          return PRODUCTS;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('montclair_products', JSON.stringify(PRODUCTS));
    return PRODUCTS;
  });
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCollection, setSelectedCollection] = useState(defaultCollection || searchParams.get('collection') || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState(500); // Increased limit as some items can be up to $425
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(defaultSort);
  
  // Mobile drawer open state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync with search URL parameter changes or prop changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
    const coll = searchParams.get('collection');
    if (coll) {
      setSelectedCollection(coll);
    }
  }, [searchParams]);

  // Sync if prop values change
  useEffect(() => {
    if (defaultCollection) {
      setSelectedCollection(defaultCollection);
    }
  }, [defaultCollection]);

  useEffect(() => {
    if (defaultSort) {
      setSortBy(defaultSort);
    }
  }, [defaultSort]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Collection Filter
    if (selectedCollection) {
      result = result.filter(p => p.collectionTag === selectedCollection);
    }

    // Size Filter
    if (selectedSize) {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }

    // Color Filter
    if (selectedColor) {
      result = result.filter(p => 
        p.color === selectedColor || 
        (p.colors && p.colors.some(c => c.name.toLowerCase().includes(selectedColor.toLowerCase())))
      );
    }

    // Price Filter
    result = result.filter(p => p.price <= priceRange);

    // Search Query matching
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sorting definition
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      // Sort by newest (higher ID or custom logic, since id represents creation order here)
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedCollection, selectedSize, selectedColor, priceRange, searchQuery, sortBy, products]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCollection('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange(500);
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Title */}
      <div className="mb-12 border-b border-brand-lightgrey/30 pb-8">
        <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider font-display text-brand-black">{title}</h1>
        <p className="text-xs text-brand-midgrey mt-2 tracking-wide font-sans max-w-2xl">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-brand-lightgrey/20">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">Search</h3>
            <input
              type="text"
              placeholder="SEARCH PRODUCT NAME..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-gold uppercase tracking-wider font-sans bg-transparent"
            />
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">Collections</h3>
            <div className="space-y-2 text-xs text-brand-midgrey">
              {['Winter Drop', 'Summer Classic', 'Autumn Essentials'].map(coll => (
                <button
                  key={coll}
                  onClick={() => setSelectedCollection(selectedCollection === coll ? '' : coll)}
                  className={`block uppercase tracking-wider transition-luxury text-left w-full ${selectedCollection === coll ? 'text-brand-gold font-bold pl-2' : 'hover:text-brand-black'}`}
                >
                  {coll}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">Categories</h3>
            <div className="space-y-2 text-xs text-brand-midgrey">
              {['t-shirts', 'polos', 'shirts', 'jackets', 'trousers', 'hoodies', 'blazers'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                  className={`block uppercase tracking-wider transition-luxury text-left w-full ${selectedCategory === cat ? 'text-brand-gold font-bold pl-2' : 'hover:text-brand-black'}`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`border text-[10px] w-9 h-9 flex items-center justify-center font-bold tracking-wider transition-luxury ${selectedSize === size ? 'bg-brand-black text-brand-beige border-brand-black' : 'border-brand-lightgrey/40 hover:border-brand-black text-brand-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">Colors</h3>
            <div className="flex space-x-3">
              {[
                { name: 'black', hex: '#0A0A0A' },
                { name: 'white', hex: '#FFFFFF' },
                { name: 'beige', hex: '#D6C5A4' },
                { name: 'gold', hex: '#C8A45D' },
                { name: 'brown', hex: '#3D2314' },
                { name: 'grey', hex: '#36454F' }
              ].map(color => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(selectedColor === color.name ? '' : color.name)}
                  style={{ backgroundColor: color.hex }}
                  className={`w-6 h-6 rounded-full border transition-luxury ${selectedColor === color.name ? 'ring-2 ring-brand-gold border-brand-white scale-110' : 'border-brand-lightgrey/60'}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">Max Price: ${priceRange}</h3>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-brand-gold bg-brand-lightgrey/30"
            />
            <div className="flex justify-between text-[10px] text-brand-midgrey mt-1">
              <span>$50</span>
              <span>$500</span>
            </div>
          </div>

          <button onClick={resetFilters} className="w-full border border-brand-black text-brand-black text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-brand-black hover:text-brand-white transition-luxury">
            Reset Filters
          </button>
        </aside>

        {/* MOBILE FILTER DRAWER BUTTON & SORT HEADER */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8 border-b border-brand-lightgrey/10 pb-4">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center space-x-2 border border-brand-lightgrey/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-black"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <span className="text-[10px] uppercase text-brand-midgrey font-medium tracking-widest hidden sm:inline">
              Showing {filteredProducts.length} results
            </span>

            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-[10px] uppercase font-bold tracking-wider text-brand-midgrey">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border border-brand-lightgrey/40 py-1.5 px-3 text-xs uppercase tracking-wider font-sans focus:outline-none focus:border-brand-gold text-brand-black"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* PRODUCT GRID */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-brand-lightgrey/40">
              <p className="text-sm text-brand-midgrey uppercase tracking-wider font-light">No products found matching filters.</p>
              <button onClick={resetFilters} className="mt-4 bg-brand-black text-brand-beige text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-brand-gold transition-luxury">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6">
              {filteredProducts.map(product => {
                const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
                return (
                  <div key={product.id} className="group flex flex-col relative">
                    <div className="relative overflow-hidden aspect-[3/4] bg-brand-lightgrey/30 group">
                      {/* Primary Image */}
                      <img 
                        src={imageSrc} 
                        alt={product.name} 
                        className={`w-full h-full object-cover transition-all duration-700 ${product.images && product.images.length > 1 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`} 
                      />
                      
                      {/* Secondary Hover Image */}
                      {product.images && product.images.length > 1 && (
                        <img 
                          src={product.images[1]} 
                          alt={`${product.name} alternate`} 
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105" 
                        />
                      )}
                      <div className="absolute inset-0 bg-brand-black/10 opacity-0 group-hover:opacity-100 transition-luxury" />
                      <div className="absolute bottom-3 left-3 right-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => onAddToCart({ ...product, size: product.sizes[0] || 'M', color: product.colors?.[0]?.name || 'Default', image: imageSrc })}
                          className="w-full bg-brand-black text-brand-white text-[9px] font-bold uppercase tracking-wider py-3 flex items-center justify-center space-x-1 hover:bg-brand-beige hover:text-brand-black transition-luxury"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>QUICK BUY</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col">
                      <span className="text-[10px] text-brand-midgrey uppercase tracking-widest font-light">{product.category}</span>
                      <h3 className="text-xs uppercase tracking-wider font-bold text-brand-black mt-1 font-display hover:text-brand-gold transition-luxury">
                        <Link to={`/product/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-xs font-bold text-brand-black/80 font-sans">${product.price}</span>
                        <div className="flex items-center text-brand-gold text-[9px]">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="ml-1 font-semibold">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm" onClick={() => setIsFilterDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-brand-white shadow-xl flex flex-col p-6 overflow-y-auto z-10 transition-transform duration-500">
            <div className="flex justify-between items-center pb-4 border-b border-brand-lightgrey/30 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-black">Filters</h2>
              <button onClick={() => setIsFilterDrawerOpen(false)} aria-label="Close filters">
                <X className="w-5 h-5 text-brand-black" />
              </button>
            </div>
            
            {/* Filter Contents inside Drawer */}
            <div className="space-y-6 text-brand-black">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-3">Search</h3>
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-brand-lightgrey/40 px-3 py-2 text-xs focus:outline-none uppercase tracking-wider font-sans bg-transparent"
                />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Collections</h3>
                <div className="space-y-2 text-xs text-brand-midgrey">
                  {['Winter Drop', 'Summer Classic', 'Autumn Essentials'].map(coll => (
                    <button
                      key={coll}
                      onClick={() => { setSelectedCollection(selectedCollection === coll ? '' : coll); setIsFilterDrawerOpen(false); }}
                      className={`block uppercase tracking-wider text-left w-full ${selectedCollection === coll ? 'text-brand-gold font-bold' : ''}`}
                    >
                      {coll}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Categories</h3>
                <div className="space-y-2 text-xs text-brand-midgrey">
                  {['t-shirts', 'polos', 'shirts', 'jackets', 'trousers', 'hoodies', 'blazers'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(selectedCategory === cat ? '' : cat); setIsFilterDrawerOpen(false); }}
                      className={`block uppercase tracking-wider text-left w-full ${selectedCategory === cat ? 'text-brand-gold font-bold' : ''}`}
                    >
                      {cat.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`border text-[10px] w-9 h-9 flex items-center justify-center font-bold transition-luxury ${selectedSize === size ? 'bg-brand-black text-brand-beige border-brand-black' : 'border-brand-lightgrey/40 text-brand-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button onClick={() => { resetFilters(); setIsFilterDrawerOpen(false); }} className="w-full border border-brand-black text-brand-black text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-brand-black hover:text-brand-white transition-luxury">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
