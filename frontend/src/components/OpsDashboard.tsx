/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, Map, Bike, BarChart2, Grid, Settings, 
  Calendar, Plus, ShoppingBag, MapPin, Clock, Leaf, 
  Sparkles, Flame, CheckCircle, ChevronRight, Play,
  HelpCircle, ListTodo, Compass, TrendingUp
} from 'lucide-react';
import { Order, MetricSummary } from '../types';
import { OPS_MANAGER_AVATAR, HEATMAP_IMG } from '../data';

interface OpsDashboardProps {
  orders: Order[];
  metrics: MetricSummary;
  addSimulatedOrder: () => void;
  dispatchPreparingOrder: (id: string) => void;
}

export default function OpsDashboard({
  orders,
  metrics,
  addSimulatedOrder,
  dispatchPreparingOrder,
}: OpsDashboardProps) {
  const [selectedWeekDay, setSelectedWeekDay] = useState<string>('JUE');
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<'orders' | 'zones' | 'demand' | null>('orders');

  // Filter out delivered orders to show active dispatcher queues
  const activeOrders = orders.filter(o => o.status !== 'delivered');

  // Simulated weekdays chart data
  const chartData = [
    { day: 'LUN', height: '60%', count: 180 },
    { day: 'MAR', height: '45%', count: 135 },
    { day: 'MIE', height: '80%', count: 240 },
    { day: 'JUE', height: '100%', count: 310, highlight: true },
    { day: 'VIE', height: '70%', count: 210 },
    { day: 'SAB', height: '30%', count: 90 },
    { day: 'DOM', height: '15%', count: 45 },
  ];

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">Pendiente</span>;
      case 'preparing':
        return <span className="bg-secondary-container text-[#3d4756] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">Preparando</span>;
      case 'en_route':
        return <span className="bg-tertiary-container/30 text-tertiary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">En Camino</span>;
      default:
        return <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">Entregado</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col lg:flex-row relative">
      {/* Sidebar Navigation Drawer (Matches Sleek Interface layout) */}
      <aside className="w-full lg:w-72 bg-slate-900 flex flex-col p-6 space-y-6 lg:fixed lg:h-screen lg:left-0 lg:top-0 z-35 shrink-0">
        <div className="p-4 flex items-center space-x-3 select-none">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight font-display">Stratos Ops</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow space-y-1 overflow-y-auto px-1">
          <a href="#dashboard" className="flex items-center space-x-3 px-4 py-3 bg-slate-800 text-white rounded-xl transition-all">
            <LayoutDashboard className="w-5 h-5 text-slate-300 opacity-80" />
            <span className="text-xs font-semibold tracking-wide">Dashboard</span>
          </a>
          
          {[
            { label: 'Mapa en Vivo', icon: Map, path: 'livemap' },
            { label: 'Flota', icon: Bike, path: 'fleet' },
            { label: 'Estadísticas', icon: BarChart2, path: 'analytics' },
            { label: 'Zonas', icon: Grid, path: 'zones' },
            { label: 'Configuración', icon: Settings, path: 'settings' },
          ].map((nav, idx) => (
            <a 
              key={idx} 
              href={`#${nav.path}`}
              className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors group font-semibold text-xs"
            >
              <nav.icon className="w-5 h-5 text-slate-450 opacity-60 group-hover:opacity-100 group-hover:text-white transition-opacity" />
              <span>{nav.label}</span>
            </a>
          ))}
        </nav>

        {/* Sidebar bottom block matching Stratos design */}
        <div className="p-2 mb-2">
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-755 shadow-inner">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Capacidad de Flota</p>
            <p className="text-xs text-white font-medium">{metrics.efficiencyPercent}% Eficiencia Eco</p>
            <div className="w-full bg-slate-700 h-1.5 mt-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.efficiencyPercent}%` }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel scrollable container */}
      <main className="flex-grow lg:ml-72 min-h-screen p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full bg-slate-50">
        {/* Header toolbar */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Resumen General</h1>
            <p className="text-sm text-slate-500">Bienvenido, Gerente de Operaciones. Esto es lo que está pasando hoy en Coquimbo.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input type="text" placeholder="Buscar..." className="bg-slate-100 border-none rounded-full py-2 px-10 text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
              <span className="absolute left-4 top-2.5 opacity-30">
                <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
            </div>
            
            <button 
              onClick={() => {
                addSimulatedOrder();
                setIsNewRouteOpen(true);
                setTimeout(() => setIsNewRouteOpen(false), 2000);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-5 py-2.5 rounded-full font-display text-xs font-bold flex items-center gap-2 transition-all active:scale-95 select-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Ruta</span>
            </button>
            
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm font-display text-sm">
              OM
            </div>
          </div>
        </header>

        {/* Temporary dynamic indicator for "Nueva Ruta" */}
        {isNewRouteOpen && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3 text-indigo-700 text-xs font-semibold animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Optimizador IA: Pedido colocado y ruta reestructurada instantáneamente.</span>
          </div>
        )}

        {/* Three metrics card row (Matches screenshot #3) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Pedidos de hoy</h3>
            <p className="text-3xl font-extrabold mt-1 text-slate-900 font-display">{metrics.todayOrders.toLocaleString()}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Bike className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">
                {activeOrders.length === 0 ? 'Sin tráfico' : 'Tránsito activo'}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Entregas en curso</h3>
            <p className="text-3xl font-extrabold mt-1 text-slate-900 font-display">{activeOrders.length}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full">Cobertura 94%</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Zonas Activas</h3>
            <p className="text-3xl font-extrabold mt-1 text-slate-900 font-display">{metrics.activeZones}</p>
          </div>
        </section>

        {/* Centro de Respuestas Inteligentes Operational Q&A */}
        <section id="consultas-ia" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-bold text-slate-900 font-display">Asistente de Consultas Operativas</h2>
              </div>
              <p className="text-xs text-slate-500">
                Respuesta automática y datos en tiempo real sobre rutas, cobertura urbana y picos de demanda en Coquimbo.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-full xl:w-auto">
              <button 
                onClick={() => setActiveQuestion('orders')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeQuestion === 'orders' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>¿Cuántos pedidos y qué orden?</span>
              </button>
              
              <button 
                onClick={() => setActiveQuestion('zones')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeQuestion === 'zones' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>¿Qué zonas generan más?</span>
              </button>
              
              <button 
                onClick={() => setActiveQuestion('demand')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeQuestion === 'demand' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>¿Hora de más demanda & Semanal?</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            {activeQuestion === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100/30 space-y-3">
                    <div>
                      <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Resumen de Carga de Pedidos</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-900 font-display">{orders.length}</span>
                        <span className="text-xs font-semibold text-slate-500">en sistema de simulación</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hoy cuentas con un total acumulado de <strong className="text-slate-900">{metrics.todayOrders} pedidos</strong>. Actualmente detectamos <strong className="text-slate-900">{activeOrders.length} envíos activos</strong> (en cocina o reparto).
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                      <span>💡 Recomendación de Rutas Coquimbo:</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Para optimizar el uso de energía y reducir la huella de carbono, el ruteador IA agrupa los pedidos en un orden específico, garantizando que el Rider complete las entregas de menor distancia y prioritarios con un mínimo esfuerzo de pedaleo.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Orden sugerido para entregar los pedidos de hoy:</span>
                  </h3>
                  
                  <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                    {(() => {
                      // Custom sequence matching the priority: en_route, preparing, pending, delivered
                      const sorted = [...orders].sort((a, b) => {
                        const score = { 'en_route': 1, 'preparing': 2, 'pending': 3, 'delivered': 4 };
                        return (score[a.status] || 5) - (score[b.status] || 5);
                      });

                      return sorted.map((order, idx) => {
                        const isEnRoute = order.status === 'en_route';
                        const isPreparing = order.status === 'preparing';
                        const isPending = order.status === 'pending';
                        
                        let badgeStyle = "bg-slate-200 text-slate-700";
                        let progressText = "Espera Despacho";
                        if (isEnRoute) {
                          badgeStyle = "bg-emerald-100 text-emerald-800 font-bold";
                        } else if (isPreparing) {
                          badgeStyle = "bg-indigo-100 text-indigo-800 font-semibold";
                        } else if (isPending) {
                          badgeStyle = "bg-orange-50 text-orange-700 font-semibold";
                        } else {
                          badgeStyle = "bg-slate-100 text-slate-400";
                        }

                        return (
                          <div 
                            key={order.id} 
                            className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 shadow-xs hover:border-indigo-200 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6.5 h-6.5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold font-display text-xs shrink-0">
                                {idx + 1}º
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="font-mono text-xs font-bold text-slate-900">#{order.id.replace('RE-', '')}</span>
                                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">{order.customerName}</span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${badgeStyle}`}>
                                    {order.status === 'en_route' ? 'En Camino' : order.status === 'preparing' ? 'Preparando' : order.status === 'pending' ? 'Pendiente' : 'Entregado'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-semibold mt-1 truncate max-w-[250px]">{order.address}</p>
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <p className="text-xs font-black text-indigo-650">{order.suggestedEta || order.timeLimit}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded-sm inline-block">{order.zone}</p>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}

            {activeQuestion === 'zones' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100/30 space-y-3">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Análisis Geográfico de Demanda</span>
                    </p>
                    <div className="space-y-2 text-xs text-slate-650 leading-relaxed">
                      <p>
                        El principal generador de pedidos de la ciudad es el <strong className="text-slate-900">Sector Peñuelas</strong>. Su alta conectividad a la costanera y la gran densidad de clientes residenciales saludables concentran la mayor cantidad de entregas.
                      </p>
                      <p>
                        El <strong className="text-slate-900">Sector Centro</strong> sigue en volumen, reuniendo la demanda corporativa y de oficinas, especialmente activa entre las 13:00 y las 14:30.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                      Contribución de Pedidos por Zonas de Coquimbo (Calculada en vivo):
                    </h3>
                    
                    <div className="space-y-4">
                      {(() => {
                        // Count real-time simulation orders per zone
                        const counts = orders.reduce((acc, order) => {
                          acc[order.zone] = (acc[order.zone] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);

                        const totalSimulated = orders.length || 1;

                        const zonesMap = [
                          { name: 'Sector Peñuelas', label: 'Sector Peñuelas (Costanera/Residencial)', weight: 0.55, color: 'bg-indigo-650' },
                          { name: 'Sector Centro', label: 'Sector Centro (Comercio/Oficinas)', weight: 0.35, color: 'bg-indigo-400' },
                          { name: 'Sector El Sauce', label: 'Sector El Sauce (Expansión)', weight: 0.10, color: 'bg-amber-500' },
                        ];

                        return zonesMap.map((z) => {
                          const simCount = counts[z.name] || 0;
                          const percentage = Math.round((simCount / totalSimulated) * 100);
                          const staticPct = Math.round(z.weight * 100);
                          
                          // combine dynamic simulation counts with custom static weighting
                          const displayPct = simCount > 0 ? percentage : staticPct;
                          const displayCount = simCount > 0 ? `${simCount} pedidos activos` : 'Flujo histórico estable';

                          return (
                            <div key={z.name} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-slate-700">{z.label}</span>
                                <span className="text-slate-900 font-bold">{displayPct}% <span className="text-[10px] text-slate-400 font-medium">({displayCount})</span></span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${z.color}`} 
                                  style={{ width: `${displayPct}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-450 italic mt-4">
                    💡 <strong className="text-slate-800">Dato de Operación:</strong> Al programar despachos agrupados en el Sector Peñuelas, los repartidores logran una tasa de entrega un 25% más rápida utilizando vías eco-amigables continuas.
                  </p>
                </div>
              </div>
            )}

            {activeQuestion === 'demand' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                <div className="md:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>Horas de Alta Concentración (Mayor Demanda)</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3.5 pt-2">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pico Almuerzo</p>
                        <p className="font-extrabold text-lg text-indigo-700 mt-1">13:30 - 14:45</p>
                        <p className="text-[10px] text-slate-550 mt-1 leading-relaxed">Concentra un 42% del flujo total diario.</p>
                      </div>
                      
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pico Cena</p>
                        <p className="font-extrabold text-lg text-indigo-750 mt-1">20:00 - 21:15</p>
                        <p className="text-[10px] text-slate-550 mt-1 leading-relaxed">Concentra un 28% de la demanda diaria.</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      El pico máximo de demanda ocurre de forma consistente en el horario de almuerzo coquimbano. Preparar con anticipación los insumos antes de las 13:00 ahorra hasta un 18% en tiempos totales de despacho.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span>Volumen de Pedidos por Semana</span>
                    </h3>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Semanales</p>
                        <p className="text-3xl font-black text-slate-900 font-display mt-1">
                          {chartData.reduce((acc, d) => acc + d.count, 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1">↑ +8.5% de incremento</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promedio Diario</p>
                        <p className="text-3xl font-black text-slate-900 font-display mt-1">
                          {Math.round(chartData.reduce((acc, d) => acc + d.count, 0) / 7)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">pedidos diarios</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-100/65 font-semibold">
                    💡 <strong className="text-slate-800">Dato de Programación:</strong> Jueves es el día de mayor demanda histórica (<strong>310 pedidos</strong>). Asegura asignación doble durante el bloqueo almuerzo.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main interactive dynamic grid */}
        <section className="grid grid-cols-12 gap-6 pb-4">
          {/* Dispatcher suggestion active execution list */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <span>Orden Sugerido de Entrega</span>
              </h2>
              <span className="bg-indigo-50 text-indigo-600 px-3.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Optimizador IA
              </span>
            </div>

            {/* Responsive Queue Tables */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px] border-collapse">
                <thead className="bg-[#f8fafc] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">ID Pedido</th>
                    <th className="px-6 py-4">Courier</th>
                    <th className="px-6 py-4">Destino</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">ETA Sugerido</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                        #{order.id.replace('RE-', '')}
                      </td>

                      {/* Courier image */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={order.courier?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                            alt={order.courier?.name} 
                            className="w-8 h-8 rounded-full border border-slate-200 bg-zinc-250 object-cover object-top shrink-0"
                          />
                          <span className="text-xs font-semibold text-slate-800">
                            {order.courier?.name}
                          </span>
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 max-w-[150px] truncate">
                        {order.address}
                      </td>

                      {/* State */}
                      <td className="px-6 py-4">
                        {getStatusChip(order.status)}
                      </td>

                      {/* ETA */}
                      <td className="px-6 py-4 font-semibold text-xs text-indigo-600">
                        {order.suggestedEta || order.timeLimit}
                      </td>

                      {/* CTA Dispatch Action */}
                      <td className="px-6 py-4 text-right">
                        {order.status === 'preparing' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatchPreparingOrder(order.id);
                            }}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            Enviar
                          </button>
                        ) : order.status === 'en_route' ? (
                          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 justify-end">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            En camino
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-green-600 flex items-center gap-1 justify-end">
                            <CheckCircle className="w-4 h-4" />
                            Completado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-5 bg-slate-50/50 text-center border-t border-slate-100">
              <button className="text-xs font-semibold text-indigo-600 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer">
                <span>Ver todos los pedidos ({orders.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Map/Heatmap block & Demand trends */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-indigo-500" />
                  <span>Zonas de Mayor Demanda</span>
                </h2>

                {/* Madrid Street map simulation with glowing spots */}
                <div className="relative w-full h-44 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                  <img 
                    src={HEATMAP_IMG} 
                    alt="City Traffic Heatmap" 
                    className="w-full h-full object-cover scale-102"
                  />
                  <div className="absolute inset-0 bg-indigo-50/10 mix-blend-multiply"></div>
                  
                  {/* Glowing Heat Pulsing Circles */}
                  <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-indigo-500/30 rounded-full animate-pulse border-2 border-indigo-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                  </div>
                  <div className="absolute top-1/2 left-2/3 w-8 h-8 bg-indigo-500/20 rounded-full animate-pulse border-2 border-indigo-450"></div>
                  <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-blue-500/20 rounded-full animate-pulse border-2 border-blue-400"></div>

                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl flex justify-between items-center border border-white/40 shadow-sm">
                    <span className="font-semibold text-xs text-slate-800">Centro de Coquimbo</span>
                    <span className="text-indigo-600 font-bold text-xs">+85% flujo</span>
                  </div>
                </div>
 
                {/* Demand status progressions */}
                <div className="space-y-4 mt-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-semibold">1. Sector Peñuelas</span>
                      <span className="font-bold text-slate-900">Muy Alta</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-650 h-full rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
 
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-semibold">2. El Llano</span>
                      <span className="font-bold text-slate-900">Alta</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Peak time indicator */}
            <div className="bg-indigo-50 text-indigo-950 p-6 rounded-3xl shadow-sm border border-indigo-100/50 space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                <Clock className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs uppercase tracking-wider font-display">Hora de Mayor Demanda</h3>
              </div>
              <div className="font-extrabold text-2xl tracking-tight text-indigo-950">13:30 - 14:45</div>
              <p className="text-xs font-medium text-indigo-700/90 leading-relaxed">
                Concentración del 42% de los pedidos de comida diarios.
              </p>
            </div>
          </div>
        </section>

        {/* Weekly trends & ecological metrics row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSS custom bar chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-slate-900">Pedidos por Semana</h2>
              <select className="bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Últimos 30 días</option>
                <option>Este trimestre</option>
              </select>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-4 select-none">
              {chartData.map((data, idx) => {
                const isSelected = selectedWeekDay === data.day;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedWeekDay(data.day)}
                    className="flex-grow flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="relative w-full h-28 flex items-end">
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-10 shadow-sm">
                        {data.count} pedidos
                      </div>
                      
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isSelected 
                            ? 'bg-indigo-650 h-full' 
                            : 'bg-indigo-100 hover:bg-indigo-200'
                        }`} 
                        style={{ height: data.height }}
                      ></div>
                    </div>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-650 font-bold' : 'text-slate-400'}`}>
                      {data.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eco sustainability metrics block */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -right-16 -top-16 w-44 h-44 bg-green-50 rounded-full"></div>
            
            <div className="relative z-10 flex items-center gap-6 w-full">
              <div className="p-5 bg-green-50 text-green-600 rounded-2xl shrink-0 border border-green-100/50">
                <Leaf className="w-10 h-10" />
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="font-bold text-lg text-slate-900">
                    Impacto Ecológico
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Rutas de reparto carbono neutral certificadas esta semana.
                  </p>
                </div>
                
                <div className="flex items-center gap-5 pt-1">
                  <div>
                    <p className="font-extrabold text-2xl text-green-600 tracking-tight">
                      {metrics.co2SavedKg}kg
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      CO2 Ahorrado
                    </p>
                  </div>
                  
                  <div className="h-8 w-px bg-slate-100"></div>
                  
                  <div>
                    <p className="font-extrabold text-2xl text-indigo-600 tracking-tight">
                      {metrics.efficiencyPercent}%
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Agilidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate corporate footer matches picture #3 */}
        <footer className="w-full border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center py-8 gap-4 text-xs font-medium text-slate-400">
          <div className="font-extrabold text-indigo-600 text-sm tracking-tight font-display">RUTAS ENREDADAS</div>
          <p>© 2026 Rutas Enredadas. Urban Agility & Sustainable Nutrition.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-indigo-600 transition-colors">Política de Privacidad</a>
            <a href="#terms" className="hover:text-indigo-600 transition-colors">Términos de Servicio</a>
            <a href="#sustainability" className="hover:text-indigo-600 transition-colors">Reporte de Sostenibilidad</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
