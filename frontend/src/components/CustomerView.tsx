/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, Plus, Sparkles, Leaf, Bike, Clock, ShoppingCart, User } from 'lucide-react';
import { MenuItem, TimeSlot, Order } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_TIME_SLOTS } from '../data';

interface CustomerViewProps {
  cart: { [key: string]: number };
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (address: string, items: { id: string; quantity: number }[]) => void;
}

export default function CustomerView({
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  placeOrder,
}: CustomerViewProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>('t1');
  const [address, setAddress] = useState<string>('Av. Costanera 1500, Coquimbo');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'explore' | 'orders' | 'cart' | 'profile'>('explore');

  // Calculate cart total
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalAmount = Object.entries(cart).reduce((total, [itemId, qty]) => {
    const item = INITIAL_MENU_ITEMS.find((m) => m.id === itemId);
    return total + (item ? item.price * qty : 0);
  }, 0);

  const handleOrderSubmission = () => {
    if (cartItemCount === 0) return;
    placeOrder(address || 'Av. Costanera 1500, Coquimbo', Object.entries(cart).map(([id, quantity]) => ({ id, quantity })));
    setIsCartOpen(false);
    setActiveTab('explore');
  };

  return (
    <div className="relative min-h-screen bg-slate-50 pb-32 font-sans overflow-x-hidden text-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white z-40 px-4 flex items-center justify-between border-b border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
            <Menu className="w-5 h-5 text-indigo-600" />
          </button>
          
          <div className="flex items-center gap-2">
            {/* Custom SVG Smiling Citrus Wheel Logo */}
            <div className="w-8 h-8 rounded-full border-4 border-indigo-600 flex items-center justify-center relative overflow-hidden bg-indigo-50/50">
              <div className="absolute inset-1 rounded-full border-2 border-indigo-200"></div>
              {/* spokes */}
              <div className="absolute w-full h-0.5 bg-indigo-600/50 rotate-0"></div>
              <div className="absolute w-full h-0.5 bg-indigo-600/50 rotate-45"></div>
              <div className="absolute w-full h-0.5 bg-indigo-600/50 rotate-90"></div>
              <div className="absolute w-full h-0.5 bg-indigo-600/50 rotate-135"></div>
              {/* smiling center */}
              <div className="absolute w-2 h-2 bg-indigo-600 rounded-full z-10"></div>
              <svg className="absolute w-5 h-5 text-white z-20 bottom-1" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 10 C 8 13, 12 13, 14 10" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-indigo-600 tracking-tight">Rutas Enredadas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-550 hover:bg-slate-50 rounded-full transition-colors relative cursor-pointer">
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-indigo-600 hover:bg-slate-50 rounded-full transition-colors relative cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white font-display text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="Usuario" 
            className="w-8 h-8 rounded-full border-2 border-slate-100 object-cover"
          />
        </div>
      </header>

      {/* Main Content wrapper */}
      <main className="pt-20 px-4 max-w-md mx-auto space-y-6">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden h-44 shadow-sm bg-slate-950">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-102 hover:scale-100 transition-all duration-700" 
            src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80" 
            alt="Ciclismo Urbano" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-5">
            <h3 className="font-display font-extrabold text-white text-lg leading-tight">
              Nutrición Sostenible
              <br />a Golpe de Pedal
            </h3>
            <p className="text-slate-300 text-[11px] mt-1 line-clamp-2 leading-relaxed font-medium">
              Energía fresca para tu jornada urbana, entregada con agilidad y conciencia ambiental en menos de 30 minutos.
            </p>
          </div>
        </section>

        {/* Time Selection */}
        <section className="space-y-3">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Horario de Entrega</h4>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-4 px-4">
            {INITIAL_TIME_SLOTS.map((slot) => {
              const active = selectedSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`flex-none px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                    active 
                      ? 'bg-indigo-600 text-white border-transparent shadow-sm' 
                      : 'bg-white border-slate-100 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured dish (Bento Card Large - Avocado/Bowl) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-950">
              Menú del Día
            </h3>
            <button className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer">
              Ver todos &gt;
            </button>
          </div>

          {/* Menú del día item 1 (Large Card) */}
          {INITIAL_MENU_ITEMS.slice(0, 1).map((item) => (
            <div 
              key={item.id} 
              className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-56 group cursor-pointer"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-5 z-10">
                {/* Badges on top */}
                <div className="flex gap-2">
                  <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Bike className="w-3 h-3" />
                    Express
                  </span>
                  <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Leaf className="w-3 h-3" />
                    Eco
                  </span>
                </div>

                {/* Info at bottom */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-base leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-1.5 flex items-center justify-between">
                    <span className="font-extrabold text-white text-lg">
                      {item.price.toFixed(2).replace('.', ',')}€
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item.id);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-xs font-semibold transition-all active:scale-[0.97] shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Menú list items 2 & 3 (Compact cards) */}
          <div className="space-y-3">
            {INITIAL_MENU_ITEMS.slice(1).map((item) => {
              const countInCart = cart[item.id] || 0;
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex gap-4 hover:border-slate-200 transition-all group"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 flex-none relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-slate-500 text-xs line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-sm text-indigo-650">
                        {item.price.toFixed(2).replace('.', ',')}€
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {countInCart > 0 && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100/50">
                            {countInCart} en cesta
                          </span>
                        )}
                        <button 
                          onClick={() => addToCart(item.id)}
                          className="bg-indigo-550 hover:bg-indigo-600 text-white p-2 rounded-full transition-all active:scale-90 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic bottom bento Call-to-Action */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-650 rounded-full flex items-center justify-center border border-indigo-100">
            <ShoppingBag className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-base text-slate-900">¿Listo para tu almuerzo?</h4>
            <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
              Haz tu pedido ahora y recíbelo en bicicleta de carga ecológica en menos de 30 minutos.
            </p>
          </div>
          
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="¿Dirección de entrega?"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl text-xs px-4 py-3 text-center focus:ring-2 focus:ring-indigo-550 outline-none font-medium"
            />
            
            <button
              onClick={() => {
                if (cartItemCount === 0) {
                  addToCart('menu-1');
                }
                setIsCartOpen(true);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 hover:text-white text-white py-3.5 rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              Pedir Ahora
            </button>
          </div>
        </section>
      </main>

      {/* Slide-Up Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center">
          <div 
            className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-5 shadow-2xl border-t border-slate-100 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-650" />
                <span>Tu Pedido</span>
              </h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
              {cartItemCount === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">
                  La cesta está vacía. Selecciona un plato para empezar.
                </div>
              ) : (
                Object.entries(cart).map(([itemId, qty]) => {
                  const item = INITIAL_MENU_ITEMS.find((m) => m.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                      <div>
                        <h5 className="font-semibold text-xs text-slate-800">{item.name}</h5>
                        <p className="text-indigo-600 font-bold text-xs mt-1">
                          {item.price.toFixed(2)}€ <span className="text-slate-400 font-normal">x {qty}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-white rounded-full border border-slate-100 p-1">
                        <button 
                          onClick={() => removeFromCart(itemId)}
                          className="px-2 py-0.5 text-xs text-indigo-600 hover:bg-slate-50 rounded-full cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1">{qty}</span>
                        <button 
                          onClick={() => addToCart(itemId)}
                          className="px-2 py-0.5 text-xs text-indigo-600 hover:bg-slate-50 rounded-full cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cartItemCount > 0 && (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span>{totalAmount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Envío en Eco-bici</span>
                    <span className="text-emerald-600 font-semibold">Gratis</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-2">
                    <span>Total</span>
                    <span>{totalAmount.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="space-y-1.55">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Dirección de Entrega</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl text-xs px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>

                <button
                  onClick={handleOrderSubmission}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 hover:text-white text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  Confirmar Pedido Sostenible ({totalAmount.toFixed(2)}€)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(15,23,42,0.02)] border-t border-slate-100 flex justify-around items-center px-4 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'explore' 
              ? 'text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full flex flex-col items-center justify-center' 
              : 'text-slate-400 hover:bg-slate-50 p-2 rounded-full'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Explorar</span>
        </button>

        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'orders' 
              ? 'text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full' 
              : 'text-slate-400 hover:bg-slate-50 p-2 rounded-full'
          }`}
        >
          <Bike className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Pedidos</span>
        </button>

        <button 
          onClick={() => setIsCartOpen(true)}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            activeTab === 'cart' 
              ? 'text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full' 
              : 'text-slate-400 hover:bg-slate-50 p-2 rounded-full'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute top-1.5 right-6 bg-rose-500 text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
              {cartItemCount}
            </span>
          )}
          <span className="text-[10px] font-semibold mt-0.5">Cesta</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'profile' 
              ? 'text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full' 
              : 'text-slate-400 hover:bg-slate-50 p-2 rounded-full'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
        </button>
      </nav>
    </div>
  );
}
