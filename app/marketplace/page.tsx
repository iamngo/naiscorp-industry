'use client';

import { useEffect, useMemo, useState } from 'react';
import { mockProducts, mockSuppliers } from '@/lib/mockData';
import type { Product } from '@/types/database';
import {
  Search,
  Filter,
  Plus,
  Package,
  CheckCircle,
  MapPin,
  MessageSquare,
  Phone,
  GitCompare,
  Building2,
  Award,
  Star,
} from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products] = useState<Product[]>(mockProducts);
  const [showRFQModal, setShowRFQModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minMOQ, setMinMOQ] = useState('');
  const [productVerification, setProductVerification] = useState<'all' | 'verified' | 'pending'>('all');
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating-desc'>('relevance');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [ratingFilters, setRatingFilters] = useState<number[]>([]);

  const supplierMap = useMemo(() => {
    return new Map(mockSuppliers.map((supplier) => [supplier.id, supplier]));
  }, []);

  // Get unique categories
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products]);

  const certificationOptions = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap((product) => product.certifications ?? [])
        ),
      ).sort(),
    [products],
  );

  const topKeywords = useMemo(() => {
    const keywords = new Set<string>();
    products.forEach((product) => {
      product.name
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .forEach((word) => keywords.add(word));
      product.category && keywords.add(product.category);
    });
    return Array.from(keywords).slice(0, 8);
  }, [products]);

  const ratingOptions = [4.0, 4.5, 5.0] as const;

  const selectedRatings = useMemo(() => new Set<number>(ratingFilters), [ratingFilters]);

useEffect(() => {
  setSuggestions(topKeywords);
}, [topKeywords]);

  const filteredProducts = useMemo(() => {
    const minPriceValue = minPrice ? parseFloat(minPrice) : null;
    const maxPriceValue = maxPrice ? parseFloat(maxPrice) : null;
    const minMOQValue = minMOQ ? parseInt(minMOQ, 10) : null;

    const ratingThreshold = selectedRatings.size ? Math.max(...Array.from(selectedRatings)) : 0;

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      const matchesVerification =
        productVerification === 'all' || product.verificationStatus === productVerification;

      const matchesPriceMin = minPriceValue === null || product.price >= minPriceValue;
      const matchesPriceMax = maxPriceValue === null || product.price <= maxPriceValue;

      const matchesMOQ = minMOQValue === null || product.minOrder <= minMOQValue;

      const matchesCertifications =
        selectedCertifications.length === 0 ||
        selectedCertifications.every((cert) => product.certifications?.includes(cert));

      const supplierRating = product.supplierId
        ? supplierMap.get(product.supplierId)?.rating ?? 0
        : 0;

      const matchesRating =
        ratingThreshold === 0 || supplierRating >= ratingThreshold;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesVerification &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesMOQ &&
        matchesCertifications &&
        matchesRating
      );
    });
  }, [
    maxPrice,
    minMOQ,
    minPrice,
    productVerification,
    products,
    searchQuery,
    selectedCategory,
    selectedCertifications,
    selectedRatings,
    supplierMap,
  ]);

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];

    switch (sortOption) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        items.sort((a, b) => {
          const aDate = new Date(a.updatedAt ?? a.createdAt ?? '').getTime();
          const bDate = new Date(b.updatedAt ?? b.createdAt ?? '').getTime();
          return bDate - aDate;
        });
        break;
      case 'rating-desc':
        items.sort((a, b) => {
          const ratingA = a.supplierId ? supplierMap.get(a.supplierId)?.rating ?? 0 : 0;
          const ratingB = b.supplierId ? supplierMap.get(b.supplierId)?.rating ?? 0 : 0;
          return ratingB - ratingA;
        });
        break;
      case 'relevance':
      default:
        break;
    }

    return items;
  }, [filteredProducts, sortOption, supplierMap]);

  const comparedProducts = useMemo(
    () =>
      compareList
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product)),
    [compareList, products],
  );

  const handledSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value) {
      setSuggestions(topKeywords);
      return;
    }
    const lower = value.toLowerCase();
    const matches = products
      .map((product) => product.name)
      .filter((name) => name.toLowerCase().includes(lower))
      .slice(0, 8);
    setSuggestions(matches.length ? matches : topKeywords);
  };

  const toggleCertification = (cert: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(cert) ? prev.filter((item) => item !== cert) : [...prev, cert],
    );
  };

  const toggleRating = (rating: number) => {
    setRatingFilters((prev) =>
      prev.includes(rating) ? prev.filter((item) => item !== rating) : [...prev, rating],
    );
  };

  const handleToggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        alert('Bạn chỉ có thể so sánh tối đa 4 sản phẩm cùng lúc.');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handleClearCompare = () => setCompareList([]);

  const handleContactSupplier = (supplierId?: string) => {
    if (!supplierId) {
      alert('Không tìm thấy thông tin liên hệ của nhà cung cấp.');
      return;
    }
    const supplier = supplierMap.get(supplierId);
    if (supplier?.contactEmail) {
      window.location.href = `mailto:${supplier.contactEmail}`;
      return;
    }
    alert('Nhà cung cấp chưa cập nhật email liên hệ.');
  };

  const handleQuickChat = (productName: string) => {
    alert(`Mở hội thoại nhanh với nhà cung cấp về sản phẩm “${productName}” (Mock data).`);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setProductVerification('all');
    setMinPrice('');
    setMaxPrice('');
    setMinMOQ('');
    setSelectedCertifications([]);
    setSortOption('relevance');
    setRatingFilters([]);
    setSuggestions(topKeywords);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleRFQ = (productId: string) => {
    setSelectedProduct(productId);
    setShowRFQModal(true);
  };

  const handleSubmitRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã gửi RFQ (Yêu cầu báo giá) - Mock data');
    setShowRFQModal(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const controller = new AbortController();
    const payload = {
      q: searchQuery,
      category: selectedCategory,
      verification: productVerification,
      minPrice,
      maxPrice,
      minMOQ,
      certifications: selectedCertifications,
      ratings: ratingFilters,
      timestamp: new Date().toISOString(),
    };
    fetch('/api/analytics/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).catch(() => {});
    return () => controller.abort();
  }, [
    searchQuery,
    selectedCategory,
    productVerification,
    minPrice,
    maxPrice,
    minMOQ,
    selectedCertifications,
    ratingFilters,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              B2B e-Marketplace
            </h1>
            <button
              onClick={() => setShowProductModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Đăng sản phẩm</span>
            </button>
          </div>
          <p className="text-gray-600">
            Sàn giao dịch công nghiệp B2B - Mua bán hàng hóa từ các khu công nghiệp đã xác thực
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Search */}
            <div className="relative md:col-span-1 xl:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => handledSearchChange(e.target.value)}
                onFocus={() => {
                  setShowSuggestions(true);
                  setSuggestions(topKeywords);
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 120);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-40 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <ul className="max-h-48 overflow-auto text-sm">
                    {suggestions.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSearchQuery(item);
                            setShowSuggestions(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50"
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={productVerification}
                onChange={(e) => setProductVerification(e.target.value as 'all' | 'verified' | 'pending')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="verified">Chỉ hiển thị sản phẩm đã xác thực</option>
                <option value="pending">Sản phẩm đang chờ xác thực</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(
                    e.target.value as 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating-desc',
                  )
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="relevance">Sắp xếp: Gợi ý</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="newest">Mới cập nhật</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Giá tối thiểu (VND)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Giá tối đa (VND)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Không giới hạn"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">MOQ tối đa</label>
              <input
                type="number"
                value={minMOQ}
                onChange={(e) => setMinMOQ(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Đơn hàng tối thiểu"
                min={0}
              />
            </div>
          </div>

          {certificationOptions.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Chứng nhận yêu cầu</p>
                {selectedCertifications.length > 0 && (
                  <button
                    onClick={() => setSelectedCertifications([])}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {certificationOptions.map((cert) => {
                  const isActive = selectedCertifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCertification(cert)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        isActive
                          ? 'border-amber-500 bg-amber-100 text-amber-700'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-amber-400 hover:text-amber-600'
                      }`}
                    >
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Đánh giá tối thiểu</p>
              {selectedRatings.size > 0 && (
                <button onClick={() => setRatingFilters([])} className="text-xs text-blue-600 hover:underline">
                  Bỏ chọn
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {ratingOptions.map((rating) => {
                const active = selectedRatings.has(rating);
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => toggleRating(rating)}
                    className={`inline-flex items-center space-x-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                      active
                        ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-yellow-400 hover:text-yellow-600'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>{rating.toFixed(1)}+</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Gợi ý: kết hợp bộ lọc để tìm nhà cung cấp phù hợp nhất với nhu cầu sản xuất hoặc sourcing của bạn.
            </p>
            <button
              onClick={handleResetFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-gray-600">
          Tìm thấy {sortedProducts.length} sản phẩm phù hợp với bộ lọc hiện tại
        </div>

        {comparedProducts.length > 0 && (
          <div className="mb-6 rounded-lg border border-dashed border-blue-300 bg-blue-50/70 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Danh sách so sánh ({comparedProducts.length}/4)
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-blue-700">
                  {comparedProducts.map((product) => (
                    <span key={product.id} className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
                      {product.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={handleClearCompare}
                className="text-xs font-medium text-blue-700 hover:text-blue-800"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const supplier = product.supplierId ? supplierMap.get(product.supplierId) : undefined;
              const isCompared = compareList.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden h-full flex flex-col"
                >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {product.verificationStatus === 'verified' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>Đã xác thực</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                  {supplier && (
                    <div className="flex items-center text-sm text-gray-600 mb-2 space-x-2">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        <Link
                          href={`/supplier/${supplier.id}`}
                          className="truncate text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {supplier.companyName}
                        </Link>
                      </div>
                      {supplier.rating && (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>
                            {supplier.rating.toFixed(1)}
                            {supplier.reviewCount ? ` (${supplier.reviewCount})` : ''}
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  {product.izId && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">Khu công nghiệp: {product.izId}</span>
                    </div>
                  )}

                  <div className="mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {product.category}
                    </span>
                  </div>

                  {product.certifications && product.certifications.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {product.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="inline-flex items-center space-x-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700"
                        >
                          <Award className="w-3 h-3" />
                          <span>{cert}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  {/* Quick actions */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handleContactSupplier(product.supplierId)}
                      className="inline-flex items-center space-x-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:border-emerald-400 hover:text-emerald-800"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Liên hệ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickChat(product.name)}
                      className="inline-flex items-center space-x-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:border-blue-400 hover:text-blue-700"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat nhanh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(product.id)}
                      className={`inline-flex items-center space-x-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        isCompared
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-purple-400 hover:text-purple-700'
                      }`}
                    >
                      <GitCompare className="w-3 h-3" />
                      <span>{isCompared ? 'Bỏ so sánh' : 'Thêm so sánh'}</span>
                    </button>
                  </div>

                  {/* Price and Order */}
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">/{product.unit}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Đơn hàng tối thiểu: {product.minOrder.toLocaleString()} {product.unit}
                    </div>
                    <button
                      onClick={() => handleRFQ(product.id)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Gửi RFQ</span>
                    </button>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm nào</p>
            <p className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

        {/* Product Upload Modal */}
        {showProductModal && (
          <ProductUploadModal
            onClose={() => setShowProductModal(false)}
            onSuccess={() => {
              setShowProductModal(false);
              // Refresh products
              window.location.reload();
            }}
          />
        )}

        {/* RFQ Modal */}
        {showRFQModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Yêu cầu Báo giá (RFQ)</h2>
              {selectedProduct && (
                <div className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                  Sản phẩm: {products.find((product) => product.id === selectedProduct)?.name ?? '---'}
                </div>
              )}
              <form onSubmit={handleSubmitRFQ} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số lượng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngân sách dự kiến (VND)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập ngân sách"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu cầu chi tiết
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả yêu cầu của bạn..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời hạn yêu cầu báo giá
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Gửi RFQ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRFQModal(false);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Upload Modal Component
function ProductUploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: 'mét',
    minOrder: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Dệt may', 'Cơ khí', 'Điện tử', 'Hóa chất', 'Thực phẩm', 'Vật liệu xây dựng', 'Khác'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      alert('Đã đăng sản phẩm thành công! (Mock data)');
      setIsSubmitting(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Đăng Sản phẩm</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: Vải Cotton 100%"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về sản phẩm..."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VND) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="45000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị *
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mét"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn hàng tối thiểu *
              </label>
              <input
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL hình ảnh
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang đăng...' : 'Đăng sản phẩm'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

