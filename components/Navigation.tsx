'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, ShoppingBag, Briefcase, Home, Menu, X, Settings, LogOut, User, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        // Not logged in
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/map', label: 'Bản đồ', icon: MapPin },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/services', label: 'Services Hub', icon: Building2 },
    { href: '/investor', label: 'Tư vấn đầu tư', icon: Briefcase },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              IZ
            </div>
            <span className="font-bold text-xl text-gray-800 hidden sm:block">
              Naiscorp Industry
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.fullName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    {(user.role === 'iz' || user.role === 'factory') && (
                      <Link
                        href="/factory/register"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Factory className="w-4 h-4" />
                        <span>Đăng ký Nhà máy</span>
                      </Link>
                    )}
                    {user.role === 'iz' && (
                      <Link
                        href="/iz/register"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Đăng ký KCN</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-3 rounded-lg bg-blue-600 text-white text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

