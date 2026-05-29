import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const TOKEN_KEY = 'access_token';

// Define the shape of our mock handler functions
type MockHandler = (config: InternalAxiosRequestConfig) => { data: any; status?: number };

// Mock data and handlers for standalone demo mode
const mockData: Record<string, MockHandler> = {
  '/me': () => ({
    data: {
      user: { id: 1, username: 'demo_admin', email: 'admin@smartovate.com', role: 'Admin' }
    }
  }),
  '/login': () => ({
    data: {
      access_token: 'mock-demo-jwt-token',
      user: { id: 1, username: 'demo_admin', email: 'admin@smartovate.com', role: 'Admin' }
    }
  }),
  '/register': () => ({
    data: {
      access_token: 'mock-demo-jwt-token',
      user: { id: 1, username: 'demo_admin', email: 'admin@smartovate.com', role: 'Admin' }
    }
  }),
  '/kpis/traffic': () => {
    const data = [];
    const baseDate = new Date();
    // Generate realistic traffic over 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - i);
      const views = Math.floor(Math.random() * 2000) + 1200;
      const visitors = Math.floor(views * (0.6 + Math.random() * 0.15));
      const bounce = parseFloat((35 + Math.random() * 20).toFixed(1));
      data.push({
        date: date.toISOString().split('T')[0],
        views,
        visitors,
        bounce
      });
    }
    return { data };
  },
  '/kpis/leads': () => ({
    data: [
      { source: 'LinkedIn', count: 32 },
      { source: 'Direct', count: 20 },
      { source: 'Search', count: 26 },
      { source: 'Referral', count: 12 }
    ]
  }),
  '/kpis/products': () => ({
    data: [
      { name: 'IA Platform', revenue: 15800, users: 468, score: 4.8 },
      { name: 'Cloud Hub', revenue: 9500, users: 320, score: 4.5 },
      { name: 'Cyber Shield', revenue: 7800, users: 150, score: 4.2 },
      { name: 'Smart Insights', revenue: 5200, users: 210, score: 4.9 }
    ]
  }),
  '/kpis/funnel': () => ({
    data: [
      { name: 'Visites', value: 45000 },
      { name: 'Sessions', value: 36000 },
      { name: 'Pages vues', value: 27000 },
      { name: 'Formulaire ouvert', value: 9000 },
      { name: 'Leads', value: 1800 },
      { name: 'Clients', value: 540 }
    ]
  }),
  '/kpis/heatmap': () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const data = [];
    for (const day of days) {
      for (let hour = 0; hour < 24; hour++) {
        let baseValue = 15;
        if ((hour >= 9 && hour <= 12) || (hour >= 18 && hour <= 21)) {
          baseValue = 65;
        }
        data.push({
          day,
          hour,
          value: baseValue + Math.floor(Math.random() * 25)
        });
      }
    }
    return { data };
  },
  '/insights/alerts': () => ({
    data: [
      {
        id: 1,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'Traffic',
        severity: 'High',
        message: 'Baisse soudaine du trafic de 25% comparé à mardi dernier.'
      },
      {
        id: 2,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'Leads',
        severity: 'Medium',
        message: 'Le taux de conversion depuis LinkedIn est supérieur à la moyenne.'
      }
    ]
  }),
  '/insights/generate': () => ({
    data: { msg: 'Insights generation triggered successfully' }
  }),
  '/settings/ai': (config) => {
    if (config.method?.toLowerCase() === 'post') {
      return { data: { msg: 'AI settings updated successfully' } };
    }
    return {
      data: {
        provider: 'openrouter',
        model_name: 'google/gemini-2.0-flash-001',
        has_key: true
      }
    };
  },
  '/admin/users': () => ({
    data: [
      { id: 1, username: 'demo_admin', email: 'admin@smartovate.com', role: 'Admin' },
      { id: 2, username: 'editor_user', email: 'editor@smartovate.com', role: 'Editor' },
      { id: 3, username: 'viewer_user', email: 'viewer@smartovate.com', role: 'Viewer' }
    ]
  }),
  '/admin/users/\\d+/role': () => ({
    data: { msg: 'User role updated successfully' }
  }),
  '/chat': (config) => {
    let payload = { message: '' };
    try {
      payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      // Ignore parse errors
    }
    
    const msg = (payload.message || '').toLowerCase();
    let reply = "Je suis SmartBot, votre assistant analytique. Je peux vous aider à comprendre vos performances de trafic, de leads et de produits. Posez-moi des questions comme 'Quel est le produit le plus rentable ?' ou 'Comment se porte le trafic ?'.";

    if (msg.includes('produit') || msg.includes('rentable') || msg.includes('revenu')) {
      reply = "Le produit le plus rentable est l'**IA Platform** avec un revenu total de **15 800 €** et 468 utilisateurs actifs. En seconde position, nous avons Cloud Hub avec **9 500 €**.";
    } else if (msg.includes('trafic') || msg.includes('visiteur') || msg.includes('vue')) {
      reply = "Le trafic total affiche une tendance positive avec une augmentation de **+5.2%** par rapport au mois dernier. Les heures de forte affluence se situent entre 9h-12h et 18h-21h.";
    } else if (msg.includes('lead') || msg.includes('conversion')) {
      reply = "Nous avons enregistré un total de **1 800 leads**. LinkedIn reste notre canal d'acquisition numéro 1 (32 leads dans notre échantillon KPI), suivi par la recherche directe.";
    } else if (msg.includes('alerte') || msg.includes('anomalie') || msg.includes('problème')) {
      reply = "Une alerte majeure (High) est actuellement active : 'Baisse soudaine du trafic de 25% comparé à mardi dernier'. L'équipe technique analyse s'il s'agit d'un problème temporaire.";
    }

    return { data: { reply } };
  },
  '/health': () => ({
    data: { status: 'healthy' }
  })
};

// Check if mock mode is currently enabled
const isMockActive = () => {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem('mock_mode') === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_API === 'true' ||
    (window as any).__use_mocks === true
  );
};

// Custom adapter to handle mock endpoints
const customAdapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  const url = config.url || '';
  
  // Clean path to extract request endpoint
  let cleanPath = url;
  if (cleanPath.startsWith(API_BASE_URL)) {
    cleanPath = cleanPath.substring(API_BASE_URL.length);
  }
  if (cleanPath.startsWith('/api')) {
    cleanPath = cleanPath.substring(4);
  }
  const pathWithoutQuery = cleanPath.split('?')[0];

  // Try exact match then regex match
  let handler = mockData[pathWithoutQuery];
  if (!handler) {
    for (const key of Object.keys(mockData)) {
      if (new RegExp(`^${key}$`).test(pathWithoutQuery)) {
        handler = mockData[key];
        break;
      }
    }
  }

  // Retrieve default Axios adapter (usually xhr or http)
  const defaultAdapter = axios.defaults.adapter as any;
  if (!defaultAdapter) {
    throw new Error('Axios default adapter not found');
  }

  // If mock mode is active and we have a handler, bypass the network
  if (isMockActive() && handler) {
    const response = handler(config);
    return {
      data: response.data,
      status: response.status || 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Otherwise try to connect to the backend
  try {
    return await defaultAdapter(config);
  } catch (err: any) {
    const isNetworkError =
      err.message === 'Network Error' ||
      err.code === 'ERR_NETWORK' ||
      err.code === 'ECONNREFUSED';

    // If backend is offline, switch to mock mode and serve mock data
    if (isNetworkError && typeof window !== 'undefined' && handler) {
      console.warn('[API] Backend unreachable. Activating local mock mode.');
      (window as any).__use_mocks = true;
      localStorage.setItem('mock_mode', 'true');

      const response = handler(config);
      return {
        data: response.data,
        status: response.status || 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
    throw err;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  adapter: customAdapter,
});

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally — clear stale token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPath = typeof window !== 'undefined' && window.location.pathname === '/login';
    
    if (error.response?.status === 401 && typeof window !== 'undefined' && !isLoginPath) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export default api;

