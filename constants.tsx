
import { PlatformData, ROIEntry, ComparisonMetric, AppRoute } from './types';

export const GLOBAL_CURRENCIES: Record<string, { symbol: string; rate: number; name: string }> = {
  'USD': { symbol: '$', rate: 1, name: 'US Dollar' },
  'EUR': { symbol: '€', rate: 0.92, name: 'Euro' },
  'GBP': { symbol: '£', rate: 0.79, name: 'British Pound' },
  'JPY': { symbol: '¥', rate: 151.5, name: 'Japanese Yen' },
  'AUD': { symbol: 'A$', rate: 1.53, name: 'Australian Dollar' },
  'CAD': { symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
  'CNY': { symbol: '¥', rate: 7.23, name: 'Chinese Yuan' },
  'INR': { symbol: '₹', rate: 83.5, name: 'Indian Rupee' },
  'BDT': { symbol: '৳', rate: 109.5, name: 'Bangladeshi Taka' },
  'RUB': { symbol: '₽', rate: 92.5, name: 'Russian Ruble' },
  'BRL': { symbol: 'R$', rate: 5.15, name: 'Brazilian Real' },
  'AED': { symbol: 'dh', rate: 3.67, name: 'UAE Dirham' },
  'KRW': { symbol: '₩', rate: 1350, name: 'South Korean Won' },
  'SAR': { symbol: '﷼', rate: 3.75, name: 'Saudi Riyal' },
  'TRY': { symbol: '₺', rate: 32.5, name: 'Turkish Lira' },
  'SGD': { symbol: 'S$', rate: 1.35, name: 'Singapore Dollar' },
  'HKD': { symbol: 'HK$', rate: 7.83, name: 'Hong Kong Dollar' },
  'MXN': { symbol: 'Mex$', rate: 16.5, name: 'Mexican Peso' },
  'ZAR': { symbol: 'R', rate: 18.5, name: 'South African Rand' },
  'NGN': { symbol: '₦', rate: 1200, name: 'Nigerian Naira' },
};

export const GLOBAL_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸', region: 'North America' },
  { code: 'bn-BD', name: 'বাংলা (Bangladesh)', flag: '🇧🇩', region: 'Asia' },
  { code: 'es-ES', name: 'Español (Spain)', flag: '🇪🇸', region: 'Europe' },
  { code: 'hi-IN', name: 'हिन्दी (India)', flag: '🇮🇳', region: 'Asia' },
  { code: 'fr-FR', name: 'Français (France)', flag: '🇫🇷', region: 'Europe' },
  { code: 'zh-CN', name: '中文 (China)', flag: '🇨🇳', region: 'Asia' },
  { code: 'ru-RU', name: 'Русский (Russia)', flag: '🇷🇺', region: 'Europe' },
  { code: 'pt-BR', name: 'Português (Brazil)', flag: '🇧🇷', region: 'South America' },
  { code: 'ar-SA', name: 'العربية (Saudi Arabia)', flag: '🇸🇦', region: 'Middle East' },
  { code: 'de-DE', name: 'Deutsch (Germany)', flag: '🇩🇪', region: 'Europe' },
];

export const TRANSLATIONS: Record<string, any> = {
  'en-US': {
    [AppRoute.DASHBOARD]: 'Control Deck',
    [AppRoute.NEWS]: 'Intelligence',
    [AppRoute.ANALYTICS]: 'ROI Insights',
    [AppRoute.PUBLISHER]: 'Broadcaster',
    [AppRoute.INTEGRATIONS]: 'App Grid',
    [AppRoute.SMM_PANEL]: 'SMM Store',
    [AppRoute.RDP_SERVICES]: 'Cloud Nodes',
    [AppRoute.OTP_SERVICES]: 'OTP Gate',
    [AppRoute.ADD_FUND]: 'Wallet',
    [AppRoute.SETTINGS]: 'Terminal',
    [AppRoute.BILLING]: 'Billing Hub',
    [AppRoute.ADMIN_CONTROL]: 'Root Control',
    [AppRoute.DEPLOYMENT]: 'Build Core',
    [AppRoute.COMMUNICATIONS]: 'Comms Hub',
    growth_engine: 'Growth Engine',
    search: 'Search nodes, data, or stacks...',
    operational: 'Operational',
    infrastructure: 'Infrastructure',
    identity: 'Identity',
    profile: 'Profile',
    asset_vault: 'Asset Vault',
    logout: 'Terminate Session',
    save_changes: 'Commit Changes',
    language: 'Global Language Node'
  },
  'bn-BD': {
    [AppRoute.DASHBOARD]: 'কন্ট্রোল ডেক',
    [AppRoute.NEWS]: 'ইন্টেলিজেন্স',
    [AppRoute.ANALYTICS]: 'ROI ইনসাইটস',
    [AppRoute.PUBLISHER]: 'ব্রডকাস্টার',
    [AppRoute.INTEGRATIONS]: 'অ্যাপ গ্রিড',
    [AppRoute.SMM_PANEL]: 'SMM স্টোর',
    [AppRoute.RDP_SERVICES]: 'ক্লাউড নোডস',
    [AppRoute.OTP_SERVICES]: 'OTP গেট',
    [AppRoute.ADD_FUND]: 'ওয়ালেট',
    [AppRoute.SETTINGS]: 'টার্মিনাল',
    [AppRoute.BILLING]: 'বিলিং হাব',
    [AppRoute.ADMIN_CONTROL]: 'রুট কন্ট্রোল',
    [AppRoute.DEPLOYMENT]: 'বিল্ড কোর',
    [AppRoute.COMMUNICATIONS]: 'যোগাযোগ হাব',
    growth_engine: 'গ্রোথ ইঞ্জিন',
    search: 'সার্চ করুন...',
    operational: 'অপারেশনাল',
    infrastructure: 'ইনফ্রাস্ট্রাকচার',
    identity: 'আইডেন্টিটি',
    profile: 'প্রোফাইল',
    asset_vault: 'অ্যাসেট ভল্ট',
    logout: 'লগ আউট',
    save_changes: 'পরিবর্তন সংরক্ষণ করুন',
    language: 'ভাষা পরিবর্তন'
  },
  'es-ES': {
    [AppRoute.DASHBOARD]: 'Panel de Control',
    [AppRoute.NEWS]: 'Inteligencia',
    [AppRoute.ANALYTICS]: 'Métricas ROI',
    [AppRoute.PUBLISHER]: 'Transmisor',
    [AppRoute.INTEGRATIONS]: 'Red de Apps',
    [AppRoute.SMM_PANEL]: 'Tienda SMM',
    [AppRoute.RDP_SERVICES]: 'Nodos Cloud',
    [AppRoute.OTP_SERVICES]: 'Portal OTP',
    [AppRoute.ADD_FUND]: 'Billetera',
    [AppRoute.SETTINGS]: 'Terminal',
    [AppRoute.BILLING]: 'Centro de Facturación',
    [AppRoute.ADMIN_CONTROL]: 'Control Raíz',
    [AppRoute.DEPLOYMENT]: 'Núcleo Build',
    [AppRoute.COMMUNICATIONS]: 'Centro de Coms',
    growth_engine: 'Motor de Crecimiento',
    search: 'Buscar nodos...',
    operational: 'Operacional',
    infrastructure: 'Infraestructura',
    identity: 'Identidad',
    profile: 'Perfil',
    asset_vault: 'Bóveda de Activos',
    logout: 'Cerrar Sesión',
    save_changes: 'Guardar Cambios',
    language: 'Idioma Global'
  },
  'hi-IN': {
    [AppRoute.DASHBOARD]: 'কন্টট্রোল ডেস্ক',
    [AppRoute.NEWS]: 'ইন্টেলিজেন্স',
    [AppRoute.ANALYTICS]: 'ROI ইনসাইটস',
    [AppRoute.PUBLISHER]: 'ব্রডকাস্টার',
    [AppRoute.INTEGRATIONS]: 'অ্যাপ গ্রিড',
    [AppRoute.SMM_PANEL]: 'SMM স্টোর',
    [AppRoute.RDP_SERVICES]: 'ক্লাউড নোডস',
    [AppRoute.OTP_SERVICES]: 'OTP গেট',
    [AppRoute.ADD_FUND]: 'ওয়ালেট',
    [AppRoute.SETTINGS]: 'টর্মিনাল',
    [AppRoute.BILLING]: 'বিলিং হাব',
    [AppRoute.ADMIN_CONTROL]: 'রুট কন্ট্রোল',
    [AppRoute.DEPLOYMENT]: 'বিল্ড কোর',
    [AppRoute.COMMUNICATIONS]: 'যোগাযোগ হাব',
    growth_engine: 'গ্রোথ ইঞ্জিন',
    search: 'সার্চ করুন...',
    operational: 'অপারেশনাল',
    infrastructure: 'ইনফ্রাস্ট্রাকচার',
    identity: 'আইডেন্টিটি',
    profile: 'প্রোফাইল',
    asset_vault: 'অ্যাসেট ভল্ট',
    logout: 'লগ আউট',
    save_changes: 'পরিবর্তন সংরক্ষণ করুন',
    language: 'ভাষা পরিবর্তন'
  },
  'fr-FR': {
    [AppRoute.DASHBOARD]: 'Tableau de Bord',
    [AppRoute.NEWS]: 'Intelligence',
    [AppRoute.ANALYTICS]: 'Analyses ROI',
    [AppRoute.PUBLISHER]: 'Diffuseur',
    [AppRoute.INTEGRATIONS]: 'Grille d\'Apps',
    [AppRoute.SMM_PANEL]: 'Boutique SMM',
    [AppRoute.RDP_SERVICES]: 'Nœuds Cloud',
    [AppRoute.OTP_SERVICES]: 'Passerelle OTP',
    [AppRoute.ADD_FUND]: 'Portefeuille',
    [AppRoute.SETTINGS]: 'Terminal',
    [AppRoute.BILLING]: 'Centre de Facturation',
    [AppRoute.ADMIN_CONTROL]: 'Contrôle Racine',
    [AppRoute.DEPLOYMENT]: 'Cœur de Déploiement',
    [AppRoute.COMMUNICATIONS]: 'Hub de Comms',
    growth_engine: 'Moteur de Croissance',
    search: 'Rechercher des nœuds...',
    operational: 'Opérationnel',
    infrastructure: 'Infrastructure',
    identity: 'Identité',
    profile: 'Profil',
    asset_vault: 'Coffre d\'Actifs',
    logout: 'Terminer la Session',
    save_changes: 'Enregistrer',
    language: 'Langue Globale'
  }
};

export const GLOBAL_INTEGRATIONS = [
  // Social Networks
  { id: 'meta', name: 'Meta (FB & IG)', icon: 'fa-brands fa-meta', color: '#0668E1', category: 'Social' },
  { id: 'tiktok', name: 'TikTok', icon: 'fa-brands fa-tiktok', color: '#000000', category: 'Social' },
  { id: 'youtube', name: 'YouTube', icon: 'fa-brands fa-youtube', color: '#FF0000', category: 'Social' },
  { id: 'twitter', name: 'X (Twitter)', icon: 'fa-brands fa-x-twitter', color: '#000000', category: 'Social' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'fa-brands fa-linkedin', color: '#0A66C2', category: 'Social' },
  { id: 'snapchat', name: 'Snapchat', icon: 'fa-brands fa-snapchat', color: '#FFFC00', category: 'Social' },
  { id: 'pinterest', name: 'Pinterest', icon: 'fa-brands fa-pinterest', color: '#BD081C', category: 'Social' },
  { id: 'reddit', name: 'Reddit', icon: 'fa-brands fa-reddit', color: '#FF4500', category: 'Social' },
  
  // Messaging
  { id: 'whatsapp', name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: '#25D366', category: 'Messaging' },
  { id: 'telegram', name: 'Telegram', icon: 'fa-brands fa-telegram', color: '#0088cc', category: 'Messaging' },
  { id: 'discord', name: 'Discord', icon: 'fa-brands fa-discord', color: '#5865F2', category: 'Messaging' },
  { id: 'messenger', name: 'Messenger', icon: 'fa-brands fa-facebook-messenger', color: '#00B2FF', category: 'Messaging' },

  // AI & Intelligence
  { id: 'chatgpt', name: 'ChatGPT', icon: 'fa-solid fa-robot', color: '#10A37F', category: 'AI & Bot' },
  { id: 'gemini', name: 'Google Gemini', icon: 'fa-solid fa-star', color: '#4285F4', category: 'AI & Bot' },

  // Advertising & Tools
  { id: 'google_ads', name: 'Google Ads', icon: 'fa-brands fa-google', color: '#4285F4', category: 'Ads' },
  { id: 'shopify', name: 'Shopify', icon: 'fa-brands fa-shopify', color: '#95BF47', category: 'Ecommerce' },
  { id: 'stripe', name: 'Stripe', icon: 'fa-brands fa-stripe', color: '#635BFF', category: 'Business' },
];

export const PLATFORMS: PlatformData[] = [
  {
    id: 'meta',
    name: 'Facebook / IG',
    icon: 'fa-brands fa-facebook',
    color: '#1877F2',
    connected: true,
    metrics: [
      { label: 'Engagement Rate', value: 5.2, trend: 12, unit: '%' },
      { label: 'Post Reach', value: '12.4k', trend: -2 },
      { label: 'Ad Spend ROI', value: 3.4, trend: 5, unit: 'x' }
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'fa-brands fa-tiktok',
    color: '#000000',
    connected: true,
    metrics: [
      { label: 'Avg Watch Time', value: 42, trend: 25, unit: 's' },
      { label: 'Trending Fit', value: 88, trend: 15, unit: '%' },
      { label: 'Conversion Rate', value: 2.1, trend: 10, unit: '%' }
    ]
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'fa-brands fa-x-twitter',
    color: '#000000',
    connected: true,
    metrics: [
      { label: 'Impressions', value: '24.5k', trend: 18 },
      { label: 'Engagement Rate', value: 3.1, trend: 4.2, unit: '%' },
      { label: 'Profile Visits', value: 1240, trend: 8 }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'fa-brands fa-linkedin',
    color: '#0A66C2',
    connected: true,
    metrics: [
      { label: 'Post Impressions', value: '8.4k', trend: 22 },
      { label: 'Search Appearances', value: 412, trend: 15 },
      { label: 'Lead Quality', value: 85, trend: 10, unit: '%' }
    ]
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    icon: 'fa-brands fa-whatsapp',
    color: '#25D366',
    connected: true,
    metrics: [
      { label: 'Message Open Rate', value: 98.2, trend: 2, unit: '%' },
      { label: 'Response Time', value: 1.5, trend: -30, unit: 'm' },
      { label: 'Bot Resolution', value: 72, trend: 12, unit: '%' }
    ]
  },
  {
    id: 'google',
    name: 'Google Ads',
    icon: 'fa-brands fa-google',
    color: '#4285F4',
    connected: true,
    metrics: [
      { label: 'CTR', value: 4.12, trend: 8, unit: '%' },
      { label: 'CPC', value: 0.72, trend: -12, unit: '$' },
      { label: 'Conversions', value: 342, trend: 24 }
    ]
  }
];

export const ROI_DATA: ROIEntry[] = [
  { platform: 'Meta', spend: 1500, revenue: 5100, roi: 240 },
  { platform: 'TikTok', spend: 1200, revenue: 4200, roi: 250 },
  { platform: 'X', spend: 400, revenue: 1100, roi: 275 },
  { platform: 'LinkedIn', spend: 900, revenue: 3800, roi: 422 },
  { platform: 'Google', spend: 3000, revenue: 8400, roi: 180 },
  { platform: 'WhatsApp', spend: 300, revenue: 2100, roi: 600 },
];

export const COMPARISON_DATA: ComparisonMetric[] = [
  { subject: 'ROAS', Meta: 85, TikTok: 92, Google: 75, LinkedIn: 88, Twitter: 70 },
  { subject: 'Engagement', Meta: 120, TikTok: 150, Google: 60, LinkedIn: 95, Twitter: 140 },
  { subject: 'Retention', Meta: 95, TikTok: 65, Google: 110, LinkedIn: 130, Twitter: 50 },
  { subject: 'Cost/Acq', Meta: 100, TikTok: 80, Google: 130, LinkedIn: 120, Twitter: 90 },
  { subject: 'Scalability', Meta: 110, TikTok: 140, Google: 150, LinkedIn: 100, Twitter: 110 },
];

export const SMM_SERVICES = [
  { category: 'Instagram', group: 'Social', icon: 'fa-brands fa-instagram', color: '#E1306C', items: [
    { id: '101', type: 'Real Followers', name: 'Instagram Real Followers [Refill 30D]', price: 2.90, per: 1000, speed: '20K/Day', min: 100, max: 500000, avgTime: '1 Hour', guarantee: '30 Days', provider: 'PeakSMM', region: 'Global', stability: 'Stable' },
    { id: '102', type: 'Geo-Targeted', name: 'Instagram Followers [Brazil] - Real Active', price: 5.50, per: 1000, speed: '2K/Day', min: 100, max: 50000, avgTime: '3 Hours', guarantee: '30 Days', provider: 'LatamBoost', region: 'Brazil', stability: 'HQ' },
    { id: '103', type: 'High Quality', name: 'Instagram Followers [USA] - High Quality', price: 8.90, per: 1000, speed: '1K/Day', min: 50, max: 2000, avgTime: '6 Hours', guarantee: 'Non-Drop', provider: 'USAGrowth', region: 'USA', stability: 'Premium' },
    { id: '104', type: 'Instant Likes', name: 'Instagram Likes [Real HQ]', price: 0.95, per: 1000, speed: 'Instant', min: 50, max: 100000, avgTime: '5 Mins', guarantee: 'Lifetime', provider: 'TurboSMM', region: 'Global', stability: 'Fast' },
    { id: '107', type: 'Power Likes', name: 'Instagram Likes [Power Likes] - Monetizable', price: 4.20, per: 1000, speed: 'Fast', min: 50, max: 20000, avgTime: '10 Mins', guarantee: 'Non-Drop', provider: 'PeakSMM', region: 'Global', stability: 'HQ' },
    { id: '105', type: 'Custom Comments', name: 'Instagram Comments [Custom]', price: 12.50, per: 1000, speed: 'Organic', min: 10, max: 5000, avgTime: '6 Hours', guarantee: 'Non-Drop', provider: 'SocialKing', region: 'Global', stability: 'Safe' },
    { id: '108', type: 'Verified', name: 'Instagram Comments [Verified Accounts]', price: 85.00, per: 1000, speed: 'Slow', min: 1, max: 100, avgTime: '12 Hours', guarantee: 'Permanent', provider: 'EliteNodes', region: 'Global', stability: 'Ultra' },
    { id: '106', type: 'Viral Views', name: 'Instagram Reels Views [Viral Spread]', price: 0.20, per: 1000, speed: '1M/Day', min: 100, max: 10000000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'ViralNodes', region: 'Global', stability: 'Fast' },
    { id: '109', type: 'Live Stream', name: 'Instagram Live Stream Views [60 Min]', price: 15.00, per: 1000, speed: 'Instant', min: 100, max: 5000, avgTime: '1 Min', guarantee: 'Active', provider: 'StreamSync', region: 'Global', stability: 'HQ' },
  ]},
  { category: 'Facebook', group: 'Social', icon: 'fa-brands fa-facebook', color: '#1877F2', items: [
    { id: '201', type: 'Page Growth', name: 'Facebook Page Likes + Followers', price: 4.50, per: 1000, speed: '5K/Day', min: 100, max: 200000, avgTime: '12 Hours', guarantee: '30 Days', provider: 'MetaPro', region: 'Global', stability: 'Stable' },
    { id: '202', type: 'Geo-Targeted', name: 'Facebook Page Likes [Europe] - Real', price: 9.00, per: 1000, speed: '1K/Day', min: 100, max: 50000, avgTime: '24 Hours', guarantee: '30 Days', provider: 'EuroSocial', region: 'Europe', stability: 'HQ' },
    { id: '203', type: 'Engagement', name: 'Facebook Post Likes [Global]', price: 1.20, per: 1000, speed: 'Instant', min: 50, max: 50000, avgTime: '10 Mins', guarantee: 'Non-Drop', provider: 'FastLikes', region: 'Global', stability: 'Fast' },
    { id: '206', type: 'Engagement', name: 'Facebook Post Reactions [Love/Wow]', price: 1.80, per: 1000, speed: 'Instant', min: 50, max: 20000, avgTime: '15 Mins', guarantee: 'Lifetime', provider: 'PeakSMM', region: 'Global', stability: 'Stable' },
    { id: '204', type: 'Monetization', name: 'Facebook Video Views [Monetizable]', price: 2.80, per: 1000, speed: '50K/Day', min: 500, max: 1000000, avgTime: '24 Hours', guarantee: 'Lifetime', provider: 'MediaStream', region: 'Global', stability: 'HQ' },
    { id: '205', type: 'Community', name: 'Facebook Group Members [USA]', price: 6.50, per: 1000, speed: '500/Day', min: 100, max: 10000, avgTime: '48 Hours', guarantee: '30 Days', provider: 'USAGrowth', region: 'USA', stability: 'HQ' },
  ]},
  { category: 'TikTok', group: 'Social', icon: 'fa-brands fa-tiktok', color: '#000000', items: [
    { id: '301', type: 'Real Followers', name: 'TikTok Followers [Real Active]', price: 3.20, per: 1000, speed: '10K/Day', min: 100, max: 100000, avgTime: '4 Hours', guarantee: '30 Days', provider: 'TikViral', region: 'Global', stability: 'Stable' },
    { id: '302', type: 'Geo-Targeted', name: 'TikTok Followers [Russia] - Real', price: 4.50, per: 1000, speed: '5K/Day', min: 100, max: 50000, avgTime: '6 Hours', guarantee: '30 Days', provider: 'RuGram', region: 'Russia', stability: 'HQ' },
    { id: '303', type: 'High Quality', name: 'TikTok Likes [HQ]', price: 1.10, per: 1000, speed: 'Instant', min: 50, max: 500000, avgTime: '15 Mins', guarantee: 'Non-Drop', provider: 'TurboSMM', region: 'Global', stability: 'Fast' },
    { id: '304', type: 'Viral Views', name: 'TikTok Views [Instant]', price: 0.05, per: 1000, speed: '10M/Day', min: 1000, max: 100000000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'ViralNodes', region: 'Global', stability: 'Fast' },
    { id: '306', type: 'SEO Specific', name: 'TikTok SEO Views - Key Search Result', price: 1.20, per: 1000, speed: '100K/Day', min: 100, max: 100000, avgTime: '4 Hours', guarantee: 'Lifetime', provider: 'SearchBoost', region: 'Global', stability: 'HQ' },
    { id: '305', type: 'Shares & Saves', name: 'TikTok Shares & Saves', price: 0.25, per: 1000, speed: 'Instant', min: 100, max: 500000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'TikViral', region: 'Global', stability: 'Fast' },
  ]},
  { category: 'YouTube', group: 'Social', icon: 'fa-brands fa-youtube', color: '#FF0000', items: [
    { id: '401', type: 'Verified Subs', name: 'YouTube Subscribers [Non-Drop]', price: 22.00, per: 1000, speed: '200/Day', min: 50, max: 10000, avgTime: '24 Hours', guarantee: 'Lifetime', provider: 'TubeSync', region: 'Global', stability: 'Safe' },
    { id: '402', type: 'Monetization', name: 'YouTube Watchtime [4000 Hours] - Pack', price: 45.00, per: 1000, speed: '300H/Day', min: 1000, max: 4000, avgTime: '48 Hours', guarantee: 'Refill', provider: 'MonetizeHQ', region: 'Global', stability: 'Ultra' },
    { id: '403', type: 'Engagement', name: 'YouTube High Retention Views', price: 3.50, per: 1000, speed: '10K/Day', min: 500, max: 1000000, avgTime: '2 Hours', guarantee: 'Lifetime', provider: 'TubeSync', region: 'Global', stability: 'Stable' },
  ]},
];

export const RDP_SERVICES_DATA = [
  { provider: 'DigitalOcean', providerIcon: 'fa-digital-ocean', brandColor: '#0080FF', name: 'Basic Droplet', cpu: '1 vCPU', ram: '2 GB', storage: '50 GB NVMe', price: 12, region: 'NYC-3' },
  { provider: 'DigitalOcean', providerIcon: 'fa-digital-ocean', brandColor: '#0080FF', name: 'Premium Droplet', cpu: '2 vCPU', ram: '4 GB', storage: '80 GB NVMe', price: 24, region: 'AMS-3' },
  { provider: 'AWS', providerIcon: 'fa-aws', brandColor: '#FF9900', name: 't3.medium Instance', cpu: '2 vCPU', ram: '4 GB', storage: 'EBS Only', price: 35, region: 'us-east-1' },
  { provider: 'AWS', providerIcon: 'fa-aws', brandColor: '#FF9900', name: 'c5.large Instance', cpu: '2 vCPU', ram: '4 GB', storage: 'Compute Optimized', price: 62, region: 'us-west-2' },
  { provider: 'Google', providerIcon: 'fa-google', brandColor: '#4285F4', name: 'e2-standard-2', cpu: '2 vCPU', ram: '8 GB', storage: 'Balanced Disk', price: 48, region: 'us-central1' },
];

export const PROXY_DATA = [
  { id: 'p1', provider: 'Luminati', providerIcon: 'fa-solid fa-network-wired', brandColor: '#4F46E5', name: 'Residential Proxy', type: 'Residential', feature: 'Rotating IP', price: 12.50, unit: 'GB', locations: ['USA', 'UK', 'Germany'] },
  { id: 'p2', provider: 'Oxylabs', providerIcon: 'fa-solid fa-shield-halved', brandColor: '#10B981', name: 'Mobile Proxy', type: 'Mobile', feature: '4G/LTE Speeds', price: 45.00, unit: 'Month', locations: ['Global', 'India', 'Brazil'] },
  { id: 'p3', provider: 'Smartproxy', providerIcon: 'fa-solid fa-server', brandColor: '#F59E0B', name: 'Datacenter Proxy', type: 'Datacenter', feature: 'Unlimited Traffic', price: 0.50, unit: 'IP', locations: ['USA', 'France', 'Canada'] },
];

export const OTP_DATA = [
  { id: 'otp1', name: 'WhatsApp Verification', icon: 'fa-brands fa-whatsapp', price: 0.85, countries: ['USA', 'UK', 'Germany', 'Bangladesh', 'India'] },
  { id: 'otp2', name: 'Telegram Auth', icon: 'fa-brands fa-telegram', price: 0.45, countries: ['Russia', 'Ukraine', 'Brazil', 'Thailand'] },
  { id: 'otp3', name: 'Google Workspace', icon: 'fa-brands fa-google', price: 1.20, countries: ['USA', 'Canada', 'France', 'Australia'] },
  { id: 'otp4', name: 'TikTok Verification', icon: 'fa-brands fa-tiktok', price: 0.60, countries: ['Global', 'Vietnam', 'Philippines'] },
  { id: 'otp5', name: 'Instagram / Meta', icon: 'fa-brands fa-instagram', price: 0.75, countries: ['Global', 'Mexico', 'Spain'] },
  { id: 'otp6', name: 'Netflix Account', icon: 'fa-solid fa-tv', price: 1.50, countries: ['USA', 'Turkey', 'Argentina'] },
];
