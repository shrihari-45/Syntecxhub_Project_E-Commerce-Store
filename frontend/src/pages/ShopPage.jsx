import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import api from '../services/api';
import { Search, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ShopPage({ 
  initialSearch = '', 
  initialCategory = 'all', 
  onViewProductDetails 
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Sync props if changed
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) setSearchQuery(initialSearch);
  }, [initialSearch]);

  // Load category list and counts once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/products/categories');
        if (res.success && res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch filtered products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sort: sortBy
      };

      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (minPrice) {
        params.min_price = minPrice;
      }
      if (maxPrice) {
        params.max_price = maxPrice;
      }
      if (selectedRating) {
        params.rating = selectedRating;
      }
      if (inStockOnly) {
        params.in_stock = 'true';
      }

      const res = await api.get('/products', params);
      if (res.success && res.data) {
        setProducts(res.data.products || []);
        setTotalProducts(res.data.total || 0);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch catalog products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, selectedCategory, searchQuery, minPrice, maxPrice, selectedRating, inStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePriceChange = (type, val) => {
    setPage(1);
    if (type === 'min') setMinPrice(val);
    if (type === 'max') setMaxPrice(val);
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating(null);
    setInStockOnly(false);
    setSortBy('featured');
    setPage(1);
  };

  const hasActiveFilters = 
    (selectedCategory && selectedCategory !== 'all') || 
    searchQuery || 
    minPrice || 
    maxPrice || 
    selectedRating || 
    inStockOnly;

  return (
    <div className="container" style={{ margin: '2.5rem auto 5rem' }}>
      {/* Page Title & Breadcrumb */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
          Explore Products
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Browse our extensive collection of verified tech, fashion, home, and lifestyle essentials.
        </p>
      </div>

      <div className="shop-layout">
        {/* Left Filter Sidebar */}
        <ProductFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          selectedRating={selectedRating}
          onSelectRating={(r) => { setSelectedRating(r); setPage(1); }}
          inStockOnly={inStockOnly}
          onToggleInStock={(val) => { setInStockOnly(val); setPage(1); }}
          onReset={handleResetFilters}
        />

        {/* Right Main Catalog View */}
        <div>
          {/* Toolbar */}
          <div className="shop-toolbar">
            <div className="toolbar-results-count">
              Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products
              {selectedCategory && selectedCategory !== 'all' && (
                <span> in <em>{selectedCategory}</em></span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <label htmlFor="shop-sort-select" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Sort By:
              </label>
              <select
                id="shop-sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              >
                <option value="featured">Featured Deals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
              
              {selectedCategory && selectedCategory !== 'all' && (
                <span className="brand-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.65rem' }}>
                  {selectedCategory}
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => handleSelectCategory('all')} />
                </span>
              )}

              {searchQuery && (
                <span className="brand-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.65rem' }}>
                  "{searchQuery}"
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="brand-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.65rem' }}>
                  ${minPrice || 0} - ${maxPrice || '∞'}
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => { setMinPrice(''); setMaxPrice(''); }} />
                </span>
              )}

              {selectedRating && (
                <span className="brand-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.65rem' }}>
                  {selectedRating}★ & Up
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => setSelectedRating(null)} />
                </span>
              )}

              {inStockOnly && (
                <span className="brand-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.65rem' }}>
                  In Stock Only
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => setInStockOnly(false)} />
                </span>
              )}

              <button
                onClick={handleResetFilters}
                style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, marginLeft: '0.5rem', textDecoration: 'underline' }}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="loading-spinner"></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search size={32} />
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Products Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                We couldn't find any items matching your selected criteria. Try adjusting or clearing your filters.
              </p>
              <button
                className="btn-primary"
                style={{ background: 'var(--primary)', color: 'white' }}
                onClick={handleResetFilters}
              >
                <RotateCcw size={16} />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onViewDetails={onViewProductDetails}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '3.5rem' }}>
                  <button
                    className="icon-btn"
                    disabled={page <= 1}
                    onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ opacity: page <= 1 ? 0.4 : 1 }}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-md)',
                        background: page === p ? 'var(--primary)' : 'white',
                        color: page === p ? 'white' : 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        fontWeight: 700,
                        transition: 'var(--transition)'
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    className="icon-btn"
                    disabled={page >= totalPages}
                    onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ opacity: page >= totalPages ? 0.4 : 1 }}
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
