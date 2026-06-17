/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, Order, MetricSummary, TimeSlot } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Bowl Energético de la Huerta',
    description: 'Quinoa real, kale orgánico, boniato asado y aderezo cítrico de la casa.',
    price: 12.50,
    tags: ['EXPRESS', 'ECO'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'menu-2',
    name: 'Pasta de la Huerta',
    description: 'Pesto de albahaca fresca y tomates cherry.',
    price: 10.90,
    tags: ['ECO'],
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'menu-3',
    name: 'Salmón Nórdico',
    description: 'Ensalada de brotes tiernos y vinagreta con finas hierbas.',
    price: 14.20,
    tags: ['EXPRESS'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_TIME_SLOTS: TimeSlot[] = [
  { id: 't1', time: '12:30 - 13:00', available: true },
  { id: 't2', time: '13:00 - 13:30', available: true },
  { id: 't3', time: '13:30 - 14:00', available: true },
  { id: 't4', time: '14:00 - 14:30', available: true }
];

export const COURIERS = {
  matias: {
    name: 'Matías',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDhxym3I-TB6R-BUG25Uj_R0rUxVUrzvrSV0ocSv2HRo4cOJjnyaFj_V6SHAtAY8hZ8Fcv1zrTbTEJO2f8iVEL29xNOdEtgAzt2THlwCTm7F_ujyFXd1XhR1GVR2B0yvP0kaAWfQcIE5jHCvpWeu-X47v_3AgdRu9dg4Im7EkoxZyzOn5AQ99pdzbNRpW5TnkxgHoP9dzgsBLaN0HRT3qjhut6Z5Jacy3CWGlQWV7r003gpqrxjsHndLZ2GT5qJhL7uuBHqpteJn8'
  },
  carlos: {
    name: 'Carlos M.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mNuKD4qUXXksRKsCWJr1TaCOhWMb7DT8CIPACLJl79b5FEmgr9TwQ84O9M9ujA4Vwu8mJv1prsb0J3Cw1nKVR5t9tRLRZVEN3-VG5Zp2YOKZUSop1DpaPlH7hhpd-YCcjpgYmO0N2MS0WbfTjx4vwaFXY8uqb56Fdytfyd5OM9bTyslJ4LtlLe-TdCezE4vRsFc7a9bWsqf5aTqifPixji091R41PbLVbUkEikhXLhZ1tpj1IFKtzQj3buNSDqzYDDzHmnAZHa8'
  },
  elena: {
    name: 'Elena R.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAly7Erw8CVYBno6e4KXWVJLdYW6bV0y-ZmFRr0bnthvP9-ZzunCN9bC8rG0puHFfx-YNPImKAGrhJWoaqbpkj3j_xdy2iQCBV6iSltNAQA8rk75kf_7-BCSXg2-GGHgz6nBNGTJp0l_5L-gurIYXY8w9qS44Udj5rHczMecoEsZACLnYN4n12fxPSE4yx9v2hucPOxF2Bm92kwoLRGkK69_SXXuDMC45Oz1-crg_XuMNWdIREIg5YEQTVDQmUkOtCWJfxAqzLU7pQ'
  },
  jorge: {
    name: 'Jorge S.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuPrm97GwggT26U0-23JCsXoo5rYOq5bdbCB8aMUNhpGTnahrj6binW4OEM7qo8tTripFUmOpzxXK91iYd9GBCuEOE6k8oL3xaIylaOWFN_yMmcQfbWkLYp31-tia5vqo7LWuzEpZyRis_gIYrbPUA0KNnJiNKOwyjM8x1vDMAc4IoLpETOZsul4yaBLcJulH_cX5GAmhXCQlExg5i9PaGdIDBH2F_bR_9xkL7fAOXorJLUtEfVjbKNOpyVBw8l7y5HQj4jvs3QFM'
  },
  sofia: {
    name: 'Sofia V.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeFLhgeaOh5bYqERUKnUNMVKFeoNIlfvibnMTq_PxzrpzBcdqrp3UWisxLPMcXD0VkoMzQWy1Gv-nPzoTq_4vtqiGvSYjGk_i-SFcKZkcw1O5m5a6_qOsGXstoNkslkb1YNejNPAI8LBl1JBWIx-Fm5nyTYHgT8M4bFvsYazC2tkqjvigJhvrECq_URnS3zbHeWwZAlatlqWzjAG49JfdMuIVKLde0zypBhBQKQXScbOyV5nsaqpbamABFF4P-FDF8VxREI54FQcg'
  }
};

export const INITIAL_ORDERS: Order[] = [
  // Orders for Carlos M., Elena R., Jorge S., Sofia V. as shown in the Ops Center table
  {
    id: 'RE-4921',
    customerName: 'Laura G.',
    address: 'Aldunate 850, Coquimbo',
    timeLimit: '12:15 PM',
    status: 'en_route',
    zone: 'Sector Peñuelas',
    tags: ['Pedido Carbono Neutral', 'Sin Gluten'],
    price: 25.00,
    items: [{ name: 'Bowl Energético de la Huerta', quantity: 2, price: 12.50 }],
    courier: COURIERS.carlos,
    suggestedEta: '12:15 PM'
  },
  {
    id: 'RE-4922',
    customerName: 'Pedro S.',
    address: 'Peñuelas Norte 120, Coquimbo',
    timeLimit: '12:32 PM',
    status: 'en_route',
    zone: 'Sector Peñuelas',
    tags: ['Pedido Carbono Neutral'],
    price: 10.90,
    items: [{ name: 'Pasta de la Huerta', quantity: 1, price: 10.90 }],
    courier: COURIERS.elena,
    suggestedEta: '12:32 PM'
  },
  {
    id: 'RE-4923',
    customerName: 'Marta L.',
    address: 'Av. Costanera 1420, Coquimbo',
    timeLimit: '12:45 PM',
    status: 'preparing',
    zone: 'Sector Centro',
    tags: ['Alergia a Frutos Secos'],
    price: 36.00,
    items: [
      { name: 'Salmón Nórdico', quantity: 2, price: 14.20 },
      { name: 'Pasta de la Huerta', quantity: 1, price: 10.90 }
    ],
    courier: COURIERS.jorge,
    suggestedEta: '12:45 PM'
  },
  {
    id: 'RE-4924',
    customerName: 'Eduardo F.',
    address: 'Av. El Sauce 450, Coquimbo',
    timeLimit: '12:50 PM',
    status: 'preparing',
    zone: 'Sector Peñuelas',
    tags: ['Pedido Carbono Neutral', 'Eco-Ruta'],
    price: 14.20,
    items: [{ name: 'Salmón Nórdico', quantity: 1, price: 14.20 }],
    courier: COURIERS.sofia,
    suggestedEta: '12:50 PM'
  },

  // Active Rider deliveries for Matías (Sector Peñuelas) as shown in screenshot #2
  {
    id: 'RE-5521',
    customerName: 'Andrés P.',
    address: 'Av. Costanera 1500, Coquimbo',
    timeLimit: 'Entrega antes de las 13:45',
    status: 'pending',
    zone: 'Sector Peñuelas',
    tags: ['Pedido Carbono Neutral', 'Sin Gluten'],
    price: 12.50,
    items: [{ name: 'Bowl Energético de la Huerta', quantity: 1, price: 12.50 }],
    courier: COURIERS.matias,
    suggestedEta: '13:40 PM'
  },
  {
    id: 'RE-5528',
    customerName: 'Santiago T.',
    address: 'Guayacán 240, Coquimbo',
    timeLimit: 'Entrega en 15 min',
    distanceInfo: 'A 400m de tu posición',
    status: 'pending',
    zone: 'Sector Peñuelas',
    tags: ['Alergia a Frutos Secos'],
    price: 10.90,
    items: [{ name: 'Pasta de la Huerta', quantity: 1, price: 10.90 }],
    courier: COURIERS.matias,
    suggestedEta: '13:55 PM'
  },
  {
    id: 'RE-5530',
    customerName: 'Patricia K.',
    address: 'La Cantera 1900, Coquimbo',
    timeLimit: 'Próximo Batch',
    status: 'preparing', // locked, waiting for kitchen confirmation
    zone: 'Sector Centro',
    tags: ['Pedido Carbono Neutral'],
    price: 14.20,
    items: [{ name: 'Salmón Nórdico', quantity: 1, price: 14.20 }],
    courier: COURIERS.matias,
    suggestedEta: '14:20 PM'
  }
];

export const INITIAL_METRICS: MetricSummary = {
  todayOrders: 1284,
  activeDeliveries: 42,
  activeZones: 18,
  co2SavedKg: 450,
  efficiencyPercent: 92
};

export const HEATMAP_IMG = 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80';

export const BONS_AIRES_MAP = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80';

export const OPS_MANAGER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpUIVm4xIRdvoeeNNVnsdQ4RyXhzi1rmgX7Eq_LT32vl_tQrf16POIUmGWrdt2t5j7qKaHjvqiOZBOoiYVVGB7aDiF3njnPTMqPDoq4TkWvgJROK1_yFiFzDZPW0EtnSDKDk0GCqPSNyof65R4XewcTI1MpMOeAVE47VbfjyCj0Wm39dze_PIeQfqqU9YC4MvufwH2vOoUyYZToubcDDwBNizmo_MPbuRx4Gz2mjMqGw9tZU8UfAlSps7mpXCPHk5QJGv7YrCSaXU';
