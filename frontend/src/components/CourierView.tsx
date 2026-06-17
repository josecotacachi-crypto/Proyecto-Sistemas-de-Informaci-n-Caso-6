/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, User, Bike, Compass, MapPin, Clock, ShieldCheck, Lock, History, LayoutDashboard, Check } from 'lucide-react';
import { Order } from '../types';
import { BONS_AIRES_MAP } from '../data';

interface CourierViewProps {
  orders: Order[];
  toggleRiderStatus: () => void;
  riderStatus: 'active' | 'paused';
  completeOrder: (id: string) => void;
}

export default function CourierView({
  orders,
  toggleRiderStatus,
  riderStatus,
  completeOrder,
}: CourierViewProps) {
  const [isRouteStarted, setIsRouteStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'routes' | 'history' | 'profile'>('routes');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Filter orders assigned to Matías
  const matiasOrders = orders.filter((o) => o.courier?.name === 'Matías');
  const pendingOrders = matiasOrders.filter((o) => o.status === 'pending');
  const finishedOrders = matiasOrders.filter((o) => o.status === 'delivered');
  const preparingOrders = matiasOrders.filter((o) => o.status === 'preparing');

  const handleCompleteOrder = (id: string) => {
    setProcessingId(id);
    
    setTimeout(() => {
      completeOrder(id);
      setProcessingId(null);
      setShowToast(true);
      
      // Auto-dismiss top toast
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 pb-32 font-sans overflow-x-hidden text-slate-900">
      {/* Top Floating Success Toast */}
      <div 
        className={`fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
          showToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </span>
        <span className="font-bold text-xs tracking-wide">Entrega confirmada</span>
      </div>
 
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white z-40 px-4 flex items-center justify-between border-b border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
            <Menu className="w-5 h-5 text-indigo-600" />
          </button>
          
          <div className="flex items-center gap-1">
            <span className="font-display font-black text-base text-indigo-600 tracking-tight">Rutas Enredadas</span>
          </div>
        </div>
 
        {/* Status Badge & Profile Image */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={toggleRiderStatus}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-300 active:scale-95 cursor-pointer border ${
              riderStatus === 'active'
                ? 'bg-indigo-50 border-indigo-150 text-indigo-700 shadow-sm'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              riderStatus === 'active' 
                ? 'bg-indigo-600 animate-pulse' 
                : 'bg-slate-400'
            }`}></div>
            <span className="font-bold text-[10px] uppercase tracking-wider">
              {riderStatus === 'active' ? 'Activo' : 'En Pausa'}
            </span>
          </button>
 
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDhxym3I-TB6R-BUG25Uj_R0rUxVUrzvrSV0ocSv2HRo4cOJjnyaFj_V6SHAtAY8hZ8Fcv1zrTbTEJO2f8iVEL29xNOdEtgAzt2THlwCTm7F_ujyFXd1XhR1GVR2B0yvP0kaAWfQcIE5jHCvpWeu-X47v_3AgdRu9dg4Im7EkoxZyzOn5AQ99pdzbNRpW5TnkxgHoP9dzgsBLaN0HRT3qjhut6Z5Jacy3CWGlQWV7r003gpqrxjsHndLZ2GT5qJhL7uuBHqpteJn8" 
            alt="Matías Rider" 
            className="w-10 h-10 rounded-full border-2 border-slate-100 object-cover object-top shadow-xs"
          />
        </div>
      </header>
 
      {/* Main Container */}
      <main className="pt-20 px-4 max-w-md mx-auto space-y-6">
        {/* Welcome Text */}
        <section className="space-y-0.5">
          <p className="text-slate-500 text-xs font-semibold">Hola, Matías</p>
          <h2 className="font-bold text-xl text-slate-900">Mis Entregas Hoy</h2>
        </section>
 
        {/* Route Preview Card (Bento Style) */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                Ruta Optimizada: <span className="text-indigo-600">Sector Peñuelas</span>
              </span>
            </div>
            <span className="text-[10px] font-bold bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
              82% Bici-Senda
            </span>
          </div>
 
          <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
            <img 
              className={`w-full h-full object-cover transition-transform duration-700 ${isRouteStarted ? 'scale-110' : 'scale-100'}`} 
              src={BONS_AIRES_MAP} 
              alt="Optimized Route Map" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
            
            <button 
              onClick={() => setIsRouteStarted(!isRouteStarted)}
              className={`absolute bottom-3 right-3 px-4.5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ${
                isRouteStarted 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-indigo-650 hover:bg-indigo-700 text-white'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${isRouteStarted ? 'animate-spin' : ''}`} />
              {isRouteStarted ? 'Ruta en Curso' : 'Iniciar Ruta'}
            </button>
          </div>
        </section>
 
        {/* Grouped Zone Deliveries */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Sector Peñuelas</span>
            </h3>
            <span className="text-xs font-semibold text-slate-505 font-sans">
              {pendingOrders.length} Pendientes
            </span>
          </div>
 
          {/* Delivery cards of Sector Peñuelas */}
          <div className="space-y-4">
            {pendingOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 border border-dashed border-slate-200 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold text-sm text-slate-900">¡Todas las entregas completadas!</p>
                <p className="text-slate-500 text-xs">Buen trabajo cuidando el asfalto y la frescura hoy.</p>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const isProcessing = processingId === order.id;
                return (
                  <div 
                    key={order.id}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500 space-y-4 hover:border-slate-200 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-slate-950">
                          {order.address}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{order.timeLimit}</span>
                        </p>
                      </div>
                      <span className="bg-slate-50 border border-slate-100 text-slate-500 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        #{order.id.replace('RE-', '')}
                      </span>
                    </div>
 
                    {/* Tag list */}
                    <div className="flex flex-wrap gap-2 pt-2.5 border-t border-slate-50">
                      {order.tags.map((tag, idx) => (
                        <span 
                           key={idx}
                          className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            tag.includes('Carbono') 
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50' 
                              : 'bg-indigo-50/50 text-indigo-650 border border-indigo-100/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {tag}
                        </span>
                      ))}
                      {order.distanceInfo && (
                        <span className="text-[9px] uppercase font-bold bg-slate-50 text-slate-500 border border-slate-100 tracking-wider px-2 py-0.5 rounded-md">
                          {order.distanceInfo}
                        </span>
                      )}
                    </div>
 
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      disabled={isProcessing}
                      className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 select-none cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                          Confirmando...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Marcar como Entregado
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
 
            {/* Locked zone (Sector Centro / Próximo batch) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between opacity-80">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 ">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Sector Centro</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400 font-sans">
                  Próximo Batch
                </span>
              </div>

              {preparingOrders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between opacity-75"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-slate-600 leading-tight">
                      {order.address}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium font-sans">
                      Esperando confirmación de cocina
                    </p>
                  </div>
                  <Lock className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(15,23,42,0.02)] border-t border-slate-100 flex justify-around items-center px-4 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('summary')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'summary' 
              ? 'text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full flex flex-col items-center justify-center' 
              : 'text-slate-400 hover:bg-slate-50 p-2 rounded-full'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Resumen</span>
        </button>

        <button 
          onClick={() => setActiveTab('routes')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'routes' 
              ? 'text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full' 
              : 'text-slate-400 hover:bg-slate-50 p-2 rounded-full'
          }`}
        >
          <Bike className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Rutas</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'history' 
              ? 'text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full' 
              : 'text-slate-400 hover:bg-slate-50 p-2 rounded-full'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Historial</span>
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
