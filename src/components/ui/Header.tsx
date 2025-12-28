import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  Terminal, 
  Store, 
  LayoutDashboard,
  User,
  LogIn,
  Sparkles
} from 'lucide-react';
import { useCartStore, useUIStore, useFilterStore } from '@/lib/store';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { activeView, setActiveView } = useUIStore();
  const { filters, setFilters } = useFilterStore();

  const navItems = [
    { id: 'store', label: 'Store', icon: Store },
    { id: 'workbench', label: 'Workbench', icon: Terminal },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                i-devr
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === item.id
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className={`hidden lg:flex items-center flex-1 max-w-md mx-8 transition-all ${
            searchFocused ? 'scale-105' : ''
          }`}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ search: e.target.value })}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-medium rounded-lg transition-all"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Mobile Nav */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeView === item.id
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Auth */}
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
