import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCartStore, useUIStore } from '@/lib/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const openModal = useUIStore((state) => state.openModal);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const handleCheckout = () => {
    // In a real app, this would redirect to Lemon Squeezy checkout
    alert('Checkout functionality would integrate with Lemon Squeezy here!');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-white">Your Cart</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 text-xs">
              {items.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="w-16 h-16 text-zinc-700 mb-4" />
              <p className="text-zinc-400 mb-2">Your cart is empty</p>
              <p className="text-zinc-500 text-sm">
                Browse our products and add something awesome!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image_url || 'https://via.placeholder.com/80'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-zinc-500 capitalize mt-0.5">
                      {item.license_type} License
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </button>
                        <span className="text-white text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <span className="font-semibold text-white text-sm">
                        {formatPrice(item.product.price_cents * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 h-fit rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-xl font-bold text-white">
                {formatPrice(getTotal())}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all"
            >
              <CreditCard className="w-5 h-5" />
              Checkout with Lemon Squeezy
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};
