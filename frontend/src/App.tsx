/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Bike, LayoutDashboard, Leaf, Sparkles, CheckCircle2, RotateCcw, Info } from 'lucide-react';
import { Order, MenuItem, MetricSummary } from './types';
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS, INITIAL_METRICS, COURIERS } from './data';
import CustomerView from './components/CustomerView';
import CourierView from './components/CourierView';
import OpsDashboard from './components/OpsDashboard';

export default function App() {
  const [activeRole, setActiveRole] = useState<'customer' | 'rider' | 'ops'>('ops');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [metrics, setMetrics] = useState<MetricSummary>(INITIAL_METRICS);
  const [riderStatus, setRiderStatus] = useState<'active' | 'paused'>('active');

  // Interactive local alert toast state
  const [globalToast, setGlobalToast] = useState<{ message: string; sub: string; type: 'success' | 'info' } | null>(null);
// 🔌 CONEXIÓN Y TRADUCCIÓN REAL DE TU BASE DE DATOS SQLITE
  useEffect(() => {
    fetch('http://localhost:3000/api/pedidos')
      .then((response) => response.json())
      .then((res) => {
        // 1. Verificamos que la base de datos nos devuelva la lista adentro de res.datos
        if (res && res.datos) {
          
          // 2. Transformamos los datos en español al formato que entiende tu diseño
          const pedidosTraducidos = res.datos.map((item: any) => {
            
            let sectorTexto = 'Sector Peñuelas';
            if (item.zona_id === 1) sectorTexto = 'Sector Norte';
            if (item.zona_id === 2) sectorTexto = 'Sector Centro';
            if (item.zona_id === 3) sectorTexto = 'Sector Sur';

            return {
              id: `RE-${item.id_pedido}`,
              customerName: `Cliente #${item.cliente_id}`,
              address: item.direccion_entrega || 'Dirección no especificada',
              timeLimit: 'Sugerido antes de las 14:15',
              distanceInfo: 'A unos clics de distancia',
              status: item.estado_entrega === 'pendiente' ? 'pending' : 'delivered',
              zone: sectorTexto,
              tags: ['Pedido Base de Datos', 'Eco-Envío'],
              price: 5000, 
              items: [{ name: 'Almuerzo Sostenible', quantity: 1, price: 5000 }],
              suggestedEta: '13:50',
              courier: { name: 'Matías', avatar: '🚴' }
            };
          });

          // 3. Ahora sí, le pasamos la lista limpia a React
          setOrders(pedidosTraducidos);
        }
      })
      .catch((error) => {
        console.error("Error al conectar con el backend:", error);
      });
  }, []);
  // Trigger auto-dismiss for global state toast
  useEffect(() => {
    if (globalToast) {
      const timer = setTimeout(() => {
        setGlobalToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [globalToast]);

  // Cart operations
  const addToCart = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    
    // Quick notification helper
    const item = INITIAL_MENU_ITEMS.find(m => m.id === id);
    if (item) {
      setGlobalToast({
        message: `Agregado a la cesta`,
        sub: `${item.name} listo para empaque.`,
        type: 'info'
      });
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[id]) return prev;
      next[id] -= 1;
      if (next[id] <= 0) {
        delete next[id];
      }
      return next;
    });
  };

  const clearCart = () => setCart({});

  // 🛒 Placing an order from CustomerView (directly syncs with Rider and Ops)
  const placeOrder = (address: string, itemsList: { id: string; quantity: number }[]) => {
    const nextIdNum = orders.length + 5500;
    const orderId = `RE-${nextIdNum}`;
    
    const configuredItems = itemsList.map((itm) => {
      const original = INITIAL_MENU_ITEMS.find((m) => m.id === itm.id)!;
      return {
        name: original.name,
        quantity: itm.quantity,
        price: original.price,
      };
    });

    const totalPrice = configuredItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    // Create the order, and automatically assign to Matías (the Courier Rider) with status 'pending'
    // so it shows up live in the "Mis Entregas Hoy" module!
    const newOrder: Order = {
      id: orderId,
      customerName: 'Cliente Local',
      address: address || 'Av. Costanera 1500, Coquimbo',
      timeLimit: 'Sugerido antes de las 14:15',
      distanceInfo: 'A 600m de tu cocina',
      status: 'pending',
      zone: 'Sector Peñuelas',
      tags: ['Pedido Carbono Neutral', 'Eco-Envío'],
      price: totalPrice,
      items: configuredItems,
      courier: COURIERS.matias,
      suggestedEta: '13:50'
    };

    setOrders((prev) => [newOrder, ...prev]);
    
    // Update dashboard metrics
    setMetrics((prev) => ({
      ...prev,
      todayOrders: prev.todayOrders + 1,
      activeDeliveries: prev.activeDeliveries + 1,
    }));

    clearCart();

    // Trigger sweet success popup
    setGlobalToast({
      message: '¡Pedido Recibido con Éxito!',
      sub: `Registrado como #${nextIdNum}. Asignado al Courier Matías de inmediato.`,
      type: 'success'
    });
  };

  // 🚴 Marking an order as delivered in CourierView (instantly syncs with metrics)
  const completeOrder = (id: string) => {
    setOrders((prev) => 
      prev.map((ord) => (ord.id === id ? { ...ord, status: 'delivered' } : ord))
    );

    // Update logistics metrics in operations control
    setMetrics((prev) => ({
      ...prev,
      activeDeliveries: Math.max(0, prev.activeDeliveries - 1),
      co2SavedKg: prev.co2SavedKg + 15, // Repartition by bike saves approx 15kg co2 vs motor vehicle
      efficiencyPercent: Math.min(100, prev.efficiencyPercent + 1)
    }));

    setGlobalToast({
      message: '¡Entrega confirmada!',
      sub: `Pedido ${id} entregado con agilidad. +15kg de CO2 Ahorrado.`,
      type: 'success'
    });
  };

  const toggleRiderStatus = () => {
    setRiderStatus((prev) => (prev === 'active' ? 'paused' : 'active'));
    setGlobalToast({
      message: riderStatus === 'active' ? 'Rider en Pausa' : 'Rider Activo',
      sub: riderStatus === 'active' ? 'Matías ha detenido la cola.' : 'Matías listo para entregas.',
      type: 'info'
    });
  };

  // 📊 Adding random/simulated dispatch inside operations dashboard
  const addSimulatedOrder = () => {
    const nextIdNum = orders.length + 4200;
    const orderId = `RE-${nextIdNum}`;
    const mockDestinations = [
      'Av. Costanera 1420, Coquimbo',
      'Aldunate 835, Centro Coquimbo',
      'Peñuelas Norte 150, Coquimbo',
      'Guayacán 240, Coquimbo',
      'Av. El Sauce 890, Coquimbo'
    ];
    const destination = mockDestinations[Math.floor(Math.random() * mockDestinations.length)];
    const couriersList = [COURIERS.carlos, COURIERS.elena, COURIERS.jorge, COURIERS.sofia];
    const assignedCourier = couriersList[Math.floor(Math.random() * couriersList.length)];

    const newOrder: Order = {
      id: orderId,
      customerName: 'Eco Comensal',
      address: destination,
      timeLimit: 'De inmediato',
      status: 'preparing',
      zone: Math.random() > 0.5 ? 'Sector Peñuelas' : 'Sector Centro',
      tags: ['Pedido Carbono Neutral'],
      price: 12.50,
      items: [{ name: 'Pasta de la Huerta', quantity: 1, price: 10.90 }],
      courier: assignedCourier,
      suggestedEta: '14:05'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      todayOrders: prev.todayOrders + 1,
    }));

    setGlobalToast({
      message: 'Nueva Ruta Registrada',
      sub: `Pedido #${nextIdNum} asignado a ${assignedCourier.name}.`,
      type: 'info'
    });
  };

  // 📊 Dispatching/Sending a preparing order inside Operations list
  const dispatchPreparingOrder = (id: string) => {
    setOrders((prev) => 
      prev.map((ord) => (ord.id === id ? { ...ord, status: 'en_route' } : ord))
    );

    const target = orders.find(o => o.id === id);
    if (target) {
      setGlobalToast({
        message: 'Pedido Despachado',
        sub: `${target.courier.name} ya está en camino a ${target.address}`,
        type: 'info'
      });
    }
  };

  const resetAllState = () => {
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      {/* Dynamic Global Notification Popup */}
      {globalToast && (
        <div className="fixed bottom-24 right-4 sm:right-6 lg:bottom-6 z-55 max-w-sm w-full bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 flex gap-3 animate-fade-in transition-all">
          <div className="p-2 bg-indigo-50 text-indigo-650 rounded-xl shrink-0">
            {globalToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
            ) : (
              <Sparkles className="w-5 h-5 text-indigo-600" />
            )}
          </div>
          <div>
            <h5 className="font-bold text-xs text-slate-900 leading-tight">
              {globalToast.message}
            </h5>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5 leading-snug">
              {globalToast.sub}
            </p>
          </div>
        </div>
      )}

      {/* Floating Demo Persona Suite Selection Header */}
      <div className="bg-slate-900 text-white border-b border-indigo-950/20 px-4 py-3 sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 select-none">
          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
            <Leaf className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-black text-xs uppercase tracking-wider text-indigo-400">
            Rutas Enredadas
          </span>
          <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg px-2.5 py-0.5 font-bold">
            Simulador de Roles
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {[
            { id: 'customer', label: 'Cliente (Menú & Pedidos)', icon: ShoppingBag, color: 'hover:bg-indigo-500/25' },
            { id: 'rider', label: 'Rider Repartidor (Matías)', icon: Bike, color: 'hover:bg-indigo-500/25' },
            { id: 'ops', label: 'Operaciones (Ops Center HQ)', icon: LayoutDashboard, color: 'hover:bg-indigo-500/25' },
          ].map((role) => {
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id as any)}
                className={`px-3 py-1.5 rounded-lg font-display text-[11px] font-bold tracking-wide flex items-center gap-1.5 transition-all select-none cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-sm scale-102' 
                    : 'bg-slate-800 text-slate-300 hover:text-white ' + role.color
                }`}
              >
                <role.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{role.label}</span>
              </button>
            );
          })}
          
          <button 
            onClick={resetAllState}
            className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Resetear simulación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render selected app role view */}
      <div className="transition-opacity duration-300">
        {activeRole === 'customer' && (
          <CustomerView 
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            placeOrder={placeOrder}
          />
        )}

        {activeRole === 'rider' && (
          <CourierView 
            orders={orders}
            toggleRiderStatus={toggleRiderStatus}
            riderStatus={riderStatus}
            completeOrder={completeOrder}
          />
        )}

        {activeRole === 'ops' && (
          <OpsDashboard 
            orders={orders}
            metrics={metrics}
            addSimulatedOrder={addSimulatedOrder}
            dispatchPreparingOrder={dispatchPreparingOrder}
          />
        )}
      </div>
    </div>
  );
}
