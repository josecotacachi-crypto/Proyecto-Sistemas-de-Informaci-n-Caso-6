/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[]; // e.g., ['EXPRESS', 'ECO', 'SIN GLUTEN']
  image: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'en_route' | 'delivered';

export interface Courier {
  name: string;
  avatar: string;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  timeLimit: string;
  distanceInfo?: string;
  status: OrderStatus;
  zone: 'Sector Peñuelas' | 'Sector Centro' | 'Sector El Sauce' | 'Zona Norte' | 'Zona Centro' | 'Zona Sur';
  tags: string[]; // e.g., ['Pedido Carbono Neutral', 'Sin Gluten', 'Alergia a Frutos Secos']
  price: number;
  items: { name: string; quantity: number; price: number }[];
  courier: Courier;
  suggestedEta: string;
}

export interface MetricSummary {
  todayOrders: number;
  activeDeliveries: number;
  activeZones: number;
  co2SavedKg: number;
  efficiencyPercent: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}
