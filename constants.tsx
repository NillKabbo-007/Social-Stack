
import { PlatformData, ROIEntry, ComparisonMetric, AppRoute } from './types';

export const GLOBAL_CURRENCIES: Record<string, { symbol: string; rate: number; name: string }> = {
  'USD': { symbol: '$', rate: 1, name: 'US Dollar' },
  'EUR': { symbol: '€', rate: 0.92, name: 'Euro' },
  'GBP': { symbol: '£', rate: 0.79, name: 'British Pound' },
  'JPY': { symbol: '¥', rate: 151.5, name: 'Japanese Yen' },
  'INR': { symbol: '₹', rate: 83.5, name: 'Indian Rupee' },
  'AED': { symbol: 'dh', rate: 3.67, name: 'UAE Dirham' },
  'SAR': { symbol: '﷼', rate: 3.75, name: 'Saudi Riyal' },
};

export const GLOBAL_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸', region: 'North America' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', region: 'Europe' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷', region: 'Europe' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
];

export const TRANSLATIONS: Record<string, any> = {
  'en-US': {
    [AppRoute.DASHBOARD]: 'Control Deck',
    [AppRoute.NEWS]: 'Intelligence',
    [AppRoute.ANALYTICS]: 'ROI Insights',
    [AppRoute.PUBLISHER]: 'Broadcaster',
    [AppRoute.INTEGRATIONS]: 'App Grid',
    [AppRoute.SMM_PANEL]: 'Network Matrix',
    [AppRoute.RDP_SERVICES]: 'Cloud Nodes',
    [AppRoute.OTP_SERVICES]: 'OTP Gate',
    [AppRoute.ADD_FUND]: 'Wallet',
    [AppRoute.SETTINGS]: 'Terminal',
    growth_engine: 'Growth Engine',
    search: 'Search nodes, data, or stacks...',
    operational: 'Operational',
    infrastructure: 'Infrastructure',
    identity: 'Identity',
    asset_vault: 'Asset Vault',
    logout: 'Terminate Session',
    save_changes: 'Commit Changes',
  }
};

export const GLOBAL_INTEGRATIONS = [
  { id: 'meta', name: 'Meta (FB & IG)', icon: 'fa-brands fa-meta', color: '#0668E1', category: 'Social' },
  { id: 'tiktok', name: 'TikTok', icon: 'fa-brands fa-tiktok', color: '#000000', category: 'Social' },
  { id: 'youtube', name: 'YouTube', icon: 'fa-brands fa-youtube', color: '#FF0000', category: 'Social' },
  { id: 'twitter', name: 'X (Twitter)', icon: 'fa-brands fa-x-twitter', color: '#000000', category: 'Social' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'fa-brands fa-linkedin', color: '#0A66C2', category: 'Social' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: '#25D366', category: 'Messaging' },
  { id: 'gemini', name: 'Google Gemini', icon: 'fa-solid fa-star', color: '#4285F4', category: 'AI & Bot' },
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
      { label: 'Trending Fit', value: 88, trend: 15, unit: '%' }
    ]
  }
];

export const ROI_DATA: ROIEntry[] = [
  { platform: 'Meta', spend: 1500, revenue: 5100, roi: 240 },
  { platform: 'TikTok', spend: 1200, revenue: 4200, roi: 250 },
  { platform: 'X', spend: 400, revenue: 1100, roi: 275 },
  { platform: 'Google', spend: 3000, revenue: 8400, roi: 180 },
];

export const COMPARISON_DATA: ComparisonMetric[] = [
  { subject: 'ROAS', Meta: 85, TikTok: 92, Google: 75, LinkedIn: 88, Twitter: 70 },
  { subject: 'Engagement', Meta: 120, TikTok: 150, Google: 60, LinkedIn: 95, Twitter: 140 },
  { subject: 'Scalability', Meta: 110, TikTok: 140, Google: 150, LinkedIn: 100, Twitter: 110 },
];

export const SMM_SERVICES = [
  { category: 'Instagram', group: 'Social', icon: 'fa-brands fa-instagram', color: '#E1306C', items: [
    { id: '101', type: 'Real Followers', name: 'Instagram Real Followers [High Stability]', price: 2.90, per: 1000, speed: '20K/Day', min: 100, max: 500000, avgTime: '1 Hour', guarantee: '30 Days', provider: 'Social Stack Core', region: 'Global', stability: 'Stable' },
    { id: '104', type: 'Instant Likes', name: 'Instagram Likes [High Quality]', price: 0.95, per: 1000, speed: 'Instant', min: 50, max: 100000, avgTime: '5 Mins', guarantee: 'Lifetime', provider: 'Social Stack Core', region: 'Global', stability: 'Fast' },
    { id: '106', type: 'Viral Views', name: 'Instagram Reels Views [Discovery Path]', price: 0.20, per: 1000, speed: '1M/Day', min: 100, max: 10000000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'Social Stack Core', region: 'Global', stability: 'Fast' },
  ]},
  { category: 'TikTok', group: 'Social', icon: 'fa-brands fa-tiktok', color: '#000000', items: [
    { id: '301', type: 'Real Followers', name: 'TikTok Followers [Active Verification]', price: 3.20, per: 1000, speed: '10K/Day', min: 100, max: 100000, avgTime: '4 Hours', guarantee: '30 Days', provider: 'Social Stack Core', region: 'Global', stability: 'Stable' },
    { id: '304', type: 'Viral Views', name: 'TikTok Views [Velocity Boost]', price: 0.05, per: 1000, speed: '10M/Day', min: 1000, max: 100000000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'Social Stack Core', region: 'Global', stability: 'Fast' },
  ]},
];

export const RDP_SERVICES_DATA = [
  { provider: 'Social Stack Cloud', providerIcon: 'fa-solid fa-server', brandColor: '#6366f1', name: 'Basic Compute Node', cpu: '1 vCPU', ram: '2 GB', storage: '50 GB NVMe', price: 12, region: 'US-EAST' },
  { provider: 'Social Stack Cloud', providerIcon: 'fa-solid fa-server', brandColor: '#6366f1', name: 'Performance Node', cpu: '2 vCPU', ram: '4 GB', storage: '80 GB NVMe', price: 24, region: 'EU-WEST' },
];

export const PROXY_DATA = [
  { id: 'p1', provider: 'Social Stack Network', providerIcon: 'fa-solid fa-network-wired', brandColor: '#4F46E5', name: 'Residential Stealth Proxy', type: 'Residential', feature: 'Rotating IP', price: 12.50, unit: 'GB', locations: ['USA', 'UK', 'DE'] },
  { id: 'p2', provider: 'Social Stack Network', providerIcon: 'fa-solid fa-shield-halved', brandColor: '#10B981', name: 'Mobile Data Node', type: 'Mobile', feature: '4G/LTE Speeds', price: 45.00, unit: 'Month', locations: ['Global'] },
];

export const OTP_DATA = [
  { id: 'otp1', name: 'WhatsApp Verification', icon: 'fa-brands fa-whatsapp', price: 0.85, countries: ['USA', 'UK', 'DE', 'IN'] },
  { id: 'otp2', name: 'Google Workspace', icon: 'fa-brands fa-google', price: 1.20, countries: ['USA', 'CA', 'FR'] },
];
