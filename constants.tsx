
import { PlatformData, ROIEntry, ComparisonMetric } from './types';

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
  // North America
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸', region: 'North America' },
  { code: 'fr-CA', name: 'Français (Canada)', flag: '🇨🇦', region: 'North America' },
  { code: 'es-MX', name: 'Español (Mexico)', flag: '🇲🇽', region: 'North America' },
  
  // Europe
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', region: 'Europe' },
  { code: 'fr-FR', name: 'Français (France)', flag: '🇫🇷', region: 'Europe' },
  { code: 'de-DE', name: 'Deutsch (Germany)', flag: '🇩🇪', region: 'Europe' },
  { code: 'it-IT', name: 'Italiano (Italy)', flag: '🇮🇹', region: 'Europe' },
  { code: 'es-ES', name: 'Español (Spain)', flag: '🇪🇸', region: 'Europe' },
  { code: 'pt-PT', name: 'Português (Portugal)', flag: '🇵🇹', region: 'Europe' },
  { code: 'nl-NL', name: 'Nederlands (Netherlands)', flag: '🇳🇱', region: 'Europe' },
  { code: 'ru-RU', name: 'Русский (Russia)', flag: '🇷🇺', region: 'Europe' },
  { code: 'sv-SE', name: 'Svenska (Sweden)', flag: '🇸🇪', region: 'Europe' },
  { code: 'pl-PL', name: 'Polski (Poland)', flag: '🇵🇱', region: 'Europe' },
  { code: 'tr-TR', name: 'Türkçe (Turkey)', flag: '🇹🇷', region: 'Europe' },
  { code: 'uk-UA', name: 'Українська (Ukraine)', flag: '🇺🇦', region: 'Europe' },

  // Asia
  { code: 'zh-CN', name: '中文 (China)', flag: '🇨🇳', region: 'Asia' },
  { code: 'hi-IN', name: 'हिन्दी (India)', flag: '🇮🇳', region: 'Asia' },
  { code: 'bn-BD', name: 'বাংলা (Bangladesh)', flag: '🇧🇩', region: 'Asia' },
  { code: 'jp-JP', name: '日本語 (Japan)', flag: '🇯🇵', region: 'Asia' },
  { code: 'ko-KR', name: '한국어 (South Korea)', flag: '🇰🇷', region: 'Asia' },
  { code: 'ar-SA', name: 'العربية (Saudi Arabia)', flag: '🇸🇦', region: 'Asia' },
  { code: 'id-ID', name: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'vi-VN', name: 'Tiếng Việt (Vietnam)', flag: '🇻🇳', region: 'Asia' },
  { code: 'th-TH', name: 'ไทย (Thailand)', flag: '🇹🇭', region: 'Asia' },
  { code: 'ms-MY', name: 'Bahasa Melayu', flag: '🇲🇾', region: 'Asia' },
  { code: 'fil-PH', name: 'Filipino', flag: '🇵🇭', region: 'Asia' },
  { code: 'ur-PK', name: 'اردو (Pakistan)', flag: '🇵🇰', region: 'Asia' },

  // South America
  { code: 'pt-BR', name: 'Português (Brazil)', flag: '🇧🇷', region: 'South America' },
  { code: 'es-AR', name: 'Español (Argentina)', flag: '🇦🇷', region: 'South America' },
  { code: 'es-CO', name: 'Español (Colombia)', flag: '🇨🇴', region: 'South America' },
  { code: 'es-CL', name: 'Español (Chile)', flag: '🇨🇱', region: 'South America' },

  // Africa
  { code: 'en-NG', name: 'English (Nigeria)', flag: '🇳🇬', region: 'Africa' },
  { code: 'en-ZA', name: 'English (South Africa)', flag: '🇿🇦', region: 'Africa' },
  { code: 'ar-EG', name: 'العربية (Egypt)', flag: '🇪🇬', region: 'Africa' },
  { code: 'fr-MA', name: 'Français (Morocco)', flag: '🇲🇦', region: 'Africa' },

  // Oceania
  { code: 'en-AU', name: 'English (Australia)', flag: '🇦🇺', region: 'Oceania' },
  { code: 'en-NZ', name: 'English (New Zealand)', flag: '🇳🇿', region: 'Oceania' },
];

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
  { id: 'threads', name: 'Threads', icon: 'fa-brands fa-threads', color: '#000000', category: 'Social' },
  { id: 'tumblr', name: 'Tumblr', icon: 'fa-brands fa-tumblr', color: '#36465D', category: 'Social' },
  { id: 'vk', name: 'VKontakte', icon: 'fa-brands fa-vk', color: '#4C75A3', category: 'Social' },
  { id: 'medium', name: 'Medium', icon: 'fa-brands fa-medium', color: '#000000', category: 'Social' },
  { id: 'quora', name: 'Quora', icon: 'fa-brands fa-quora', color: '#B92B27', category: 'Social' },
  
  // Messaging
  { id: 'whatsapp', name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: '#25D366', category: 'Messaging' },
  { id: 'telegram', name: 'Telegram', icon: 'fa-brands fa-telegram', color: '#0088cc', category: 'Messaging' },
  { id: 'discord', name: 'Discord', icon: 'fa-brands fa-discord', color: '#5865F2', category: 'Messaging' },
  { id: 'messenger', name: 'Messenger', icon: 'fa-brands fa-facebook-messenger', color: '#00B2FF', category: 'Messaging' },
  { id: 'slack', name: 'Slack', icon: 'fa-brands fa-slack', color: '#4A154B', category: 'Messaging' },
  { id: 'line', name: 'Line', icon: 'fa-brands fa-line', color: '#00C300', category: 'Messaging' },
  { id: 'wechat', name: 'WeChat', icon: 'fa-brands fa-weixin', color: '#7BB32E', category: 'Messaging' },
  { id: 'viber', name: 'Viber', icon: 'fa-brands fa-viber', color: '#665CAC', category: 'Messaging' },
  { id: 'kakao', name: 'KakaoTalk', icon: 'fa-solid fa-comment', color: '#FFE812', category: 'Messaging' },

  // AI & Intelligence
  { id: 'chatgpt', name: 'ChatGPT', icon: 'fa-solid fa-robot', color: '#10A37F', category: 'AI & Bot' },
  { id: 'grok', name: 'Grok AI', icon: 'fa-solid fa-brain', color: '#FFFFFF', category: 'AI & Bot' },
  { id: 'claude', name: 'Claude', icon: 'fa-solid fa-message', color: '#D97757', category: 'AI & Bot' },
  { id: 'midjourney', name: 'Midjourney', icon: 'fa-solid fa-palette', color: '#FFFFFF', category: 'AI & Bot' },
  { id: 'gemini', name: 'Google Gemini', icon: 'fa-solid fa-star', color: '#4285F4', category: 'AI & Bot' },
  { id: 'jasper', name: 'Jasper AI', icon: 'fa-solid fa-pen-nib', color: '#9747FF', category: 'AI & Bot' },

  // Advertising & Tools
  { id: 'google_ads', name: 'Google Ads', icon: 'fa-brands fa-google', color: '#4285F4', category: 'Ads' },
  { id: 'amazon_ads', name: 'Amazon Ads', icon: 'fa-brands fa-amazon', color: '#FF9900', category: 'Ads' },
  { id: 'shopify', name: 'Shopify', icon: 'fa-brands fa-shopify', color: '#95BF47', category: 'Ecommerce' },
  { id: 'wordpress', name: 'WordPress', icon: 'fa-brands fa-wordpress', color: '#21759B', category: 'CMS' },
  { id: 'twitch', name: 'Twitch', icon: 'fa-brands fa-twitch', color: '#9146FF', category: 'Streaming' },
  { id: 'vimeo', name: 'Vimeo', icon: 'fa-brands fa-vimeo', color: '#1AB7EA', category: 'Streaming' },
  { id: 'dailymotion', name: 'Dailymotion', icon: 'fa-brands fa-dailymotion', color: '#000000', category: 'Streaming' },
  { id: 'salesforce', name: 'Salesforce', icon: 'fa-brands fa-salesforce', color: '#00A1E0', category: 'Business' },
  { id: 'hubspot', name: 'HubSpot', icon: 'fa-brands fa-hubspot', color: '#FF7A59', category: 'Business' },
  { id: 'mailchimp', name: 'Mailchimp', icon: 'fa-brands fa-mailchimp', color: '#FFE01B', category: 'Business' },
  { id: 'zoom', name: 'Zoom', icon: 'fa-video', color: '#2D8CFF', category: 'Business' },
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
    { id: '101', type: 'Followers', name: 'Instagram Real Followers [Refill 30D]', price: 2.90, per: 1000, speed: '20K/Day', min: 100, max: 500000, avgTime: '1 Hour', guarantee: '30 Days', provider: 'PeakSMM', region: 'Global' },
    { id: '102', type: 'Followers', name: 'Instagram Followers [Brazil] - Real Active', price: 5.50, per: 1000, speed: '2K/Day', min: 100, max: 50000, avgTime: '3 Hours', guarantee: '30 Days', provider: 'LatamBoost', region: 'Brazil' },
    { id: '103', type: 'Followers', name: 'Instagram Followers [USA] - High Quality', price: 8.90, per: 1000, speed: '1K/Day', min: 50, max: 20000, avgTime: '6 Hours', guarantee: 'Non-Drop', provider: 'USAGrowth', region: 'USA' },
    { id: '104', type: 'Likes', name: 'Instagram Likes [Real HQ]', price: 0.95, per: 1000, speed: 'Instant', min: 50, max: 100000, avgTime: '5 Mins', guarantee: 'Lifetime', provider: 'TurboSMM', region: 'Global' },
    { id: '105', type: 'Comments', name: 'Instagram Comments [Custom]', price: 12.50, per: 1000, speed: 'Organic', min: 10, max: 5000, avgTime: '6 Hours', guarantee: 'Non-Drop', provider: 'SocialKing', region: 'Global' },
    { id: '106', type: 'Views', name: 'Instagram Reels Views', price: 0.20, per: 1000, speed: '1M/Day', min: 100, max: 10000000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'ViralNodes', region: 'Global' },
  ]},
  { category: 'Facebook', group: 'Social', icon: 'fa-brands fa-facebook', color: '#1877F2', items: [
    { id: '201', type: 'Followers', name: 'Facebook Page Likes + Followers', price: 4.50, per: 1000, speed: '5K/Day', min: 100, max: 200000, avgTime: '12 Hours', guarantee: '30 Days', provider: 'MetaPro', region: 'Global' },
    { id: '202', type: 'Followers', name: 'Facebook Page Likes [Europe] - Real', price: 9.00, per: 1000, speed: '1K/Day', min: 100, max: 50000, avgTime: '24 Hours', guarantee: '30 Days', provider: 'EuroSocial', region: 'Europe' },
    { id: '203', type: 'Likes', name: 'Facebook Post Likes [Global]', price: 1.20, per: 1000, speed: 'Instant', min: 50, max: 50000, avgTime: '10 Mins', guarantee: 'Non-Drop', provider: 'FastLikes', region: 'Global' },
    { id: '204', type: 'Views', name: 'Facebook Video Views [Monetizable]', price: 2.80, per: 1000, speed: '50K/Day', min: 500, max: 1000000, avgTime: '24 Hours', guarantee: 'Lifetime', provider: 'MediaStream', region: 'Global' },
    { id: '205', type: 'Members', name: 'Facebook Group Members [USA]', price: 6.50, per: 1000, speed: '500/Day', min: 100, max: 10000, avgTime: '48 Hours', guarantee: '30 Days', provider: 'USAGrowth', region: 'USA' },
  ]},
  { category: 'TikTok', group: 'Social', icon: 'fa-brands fa-tiktok', color: '#000000', items: [
    { id: '301', type: 'Followers', name: 'TikTok Followers [Real Active]', price: 3.20, per: 1000, speed: '10K/Day', min: 100, max: 100000, avgTime: '4 Hours', guarantee: '30 Days', provider: 'TikViral', region: 'Global' },
    { id: '302', type: 'Followers', name: 'TikTok Followers [Russia] - Real', price: 4.50, per: 1000, speed: '5K/Day', min: 100, max: 50000, avgTime: '6 Hours', guarantee: '30 Days', provider: 'RuGram', region: 'Russia' },
    { id: '303', type: 'Likes', name: 'TikTok Likes [HQ]', price: 1.10, per: 1000, speed: 'Instant', min: 50, max: 500000, avgTime: '15 Mins', guarantee: 'Non-Drop', provider: 'TurboSMM', region: 'Global' },
    { id: '304', type: 'Views', name: 'TikTok Views [Instant]', price: 0.05, per: 1000, speed: '10M/Day', min: 1000, max: 100000000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'ViralNodes', region: 'Global' },
    { id: '305', type: 'Shares', name: 'TikTok Shares & Saves', price: 0.25, per: 1000, speed: 'Instant', min: 100, max: 500000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'TikViral', region: 'Global' },
  ]},
  { category: 'YouTube', group: 'Media', icon: 'fa-brands fa-youtube', color: '#FF0000', items: [
    { id: '401', type: 'Views', name: 'YouTube Views [High Retention]', price: 4.50, per: 1000, speed: '10K/Day', min: 500, max: 2000000, avgTime: '24 Hours', guarantee: 'Lifetime', provider: 'YTGuru', region: 'Global' },
    { id: '402', type: 'Views', name: 'YouTube Views [India] - Targeted', price: 3.50, per: 1000, speed: '20K/Day', min: 1000, max: 500000, avgTime: '12 Hours', guarantee: 'Lifetime', provider: 'IndoMedia', region: 'India' },
    { id: '403', type: 'Subscribers', name: 'YouTube Subscribers [Real]', price: 25.00, per: 1000, speed: '500/Day', min: 50, max: 50000, avgTime: '48 Hours', guarantee: '30 Days', provider: 'SubBoost', region: 'Global' },
    { id: '404', type: 'Likes', name: 'YouTube Likes [Non-Drop]', price: 2.50, per: 1000, speed: 'Instant', min: 50, max: 100000, avgTime: '1 Hour', guarantee: 'Lifetime', provider: 'FastLikes', region: 'Global' },
    { id: '405', type: 'Watch Time', name: 'YouTube Watch Time [4000 Hours Pack]', price: 65.00, per: 1000, speed: 'Organic', min: 500, max: 4000, avgTime: '7-14 Days', guarantee: 'Monetization', provider: 'YTGuru', region: 'Global' },
  ]},
  { category: 'Telegram', group: 'Messaging', icon: 'fa-brands fa-telegram', color: '#24A1DE', items: [
    { id: '701', type: 'Members', name: 'Telegram Channel Members [Global]', price: 2.10, per: 1000, speed: 'Instant', min: 100, max: 200000, avgTime: '10 Mins', guarantee: 'Non-Drop', provider: 'TeleForce', region: 'Global' },
    { id: '702', type: 'Members', name: 'Telegram Members [China] - Crypto', price: 5.50, per: 1000, speed: '2K/Day', min: 100, max: 50000, avgTime: '4 Hours', guarantee: 'Non-Drop', provider: 'AsiaNodes', region: 'China' },
    { id: '703', type: 'Members', name: 'Telegram Members [Russia] - Real', price: 4.80, per: 1000, speed: '5K/Day', min: 100, max: 100000, avgTime: '2 Hours', guarantee: '30 Days', provider: 'RuGram', region: 'Russia' },
    { id: '704', type: 'Views', name: 'Telegram Post Views [Last 5 Posts]', price: 0.45, per: 1000, speed: 'Instant', min: 500, max: 1000000, avgTime: 'Instant', guarantee: 'Lifetime', provider: 'FastLikes', region: 'Global' },
  ]},
  { category: 'X / Twitter', group: 'Social', icon: 'fa-brands fa-x-twitter', color: '#000000', items: [
    { id: '501', type: 'Followers', name: 'X Followers [NFT/Crypto Profiles]', price: 5.50, per: 1000, speed: '2K/Day', min: 100, max: 50000, avgTime: '12 Hours', guarantee: '30 Days', provider: 'CryptoBoost', region: 'Global' },
    { id: '502', type: 'Likes', name: 'X Likes/Favorites', price: 1.80, per: 1000, speed: 'Fast', min: 50, max: 20000, avgTime: '30 Mins', guarantee: 'Non-Drop', provider: 'TweetDeck', region: 'Global' },
    { id: '503', type: 'Retweets', name: 'X Retweets [USA] - Real', price: 8.50, per: 1000, speed: '500/Day', min: 20, max: 5000, avgTime: '4 Hours', guarantee: 'Non-Drop', provider: 'USAGrowth', region: 'USA' },
  ]},
  { category: 'Spotify', group: 'Media', icon: 'fa-brands fa-spotify', color: '#1DB954', items: [
    { id: '801', type: 'Plays', name: 'Spotify Plays [Premium/US]', price: 1.80, per: 1000, speed: '5K/Day', min: 1000, max: 1000000, avgTime: '24 Hours', guarantee: 'Lifetime', provider: 'MusicPush', region: 'USA' },
    { id: '802', type: 'Plays', name: 'Spotify Plays [Global] - Mixed', price: 0.90, per: 1000, speed: '10K/Day', min: 1000, max: 5000000, avgTime: '12 Hours', guarantee: 'Lifetime', provider: 'StreamKing', region: 'Global' },
    { id: '803', type: 'Listeners', name: 'Spotify Monthly Listeners', price: 3.20, per: 1000, speed: 'Natural', min: 1000, max: 500000, avgTime: '48 Hours', guarantee: '30 Days', provider: 'MusicPush', region: 'Global' },
  ]},
  { category: 'Discord', group: 'Messaging', icon: 'fa-brands fa-discord', color: '#5865F2', items: [
    { id: '901', type: 'Members', name: 'Discord Server Members [Online]', price: 12.00, per: 1000, speed: 'Fast', min: 100, max: 10000, avgTime: '12 Hours', guarantee: '30 Days', provider: 'DiscordHype', region: 'Global' },
    { id: '902', type: 'Members', name: 'Discord Server Members [Offline]', price: 6.50, per: 1000, speed: 'Fast', min: 100, max: 20000, avgTime: '6 Hours', guarantee: '30 Days', provider: 'DiscordHype', region: 'Global' },
    { id: '903', type: 'Boosts', name: 'Discord Server Boosts [3 Months]', price: 4.50, per: 1, speed: 'Instant', min: 1, max: 14, avgTime: '15 Mins', guarantee: '90 Days', provider: 'NitroBoost', region: 'Global' },
  ]},
  { category: 'LinkedIn', group: 'Social', icon: 'fa-brands fa-linkedin', color: '#0A66C2', items: [
    { id: '601', type: 'Followers', name: 'LinkedIn Followers [Professional]', price: 15.00, per: 1000, speed: '500/Day', min: 50, max: 20000, avgTime: '24 Hours', guarantee: '30 Days', provider: 'BizGrow', region: 'Global' },
    { id: '602', type: 'Followers', name: 'LinkedIn Followers [USA] - Real', price: 25.00, per: 1000, speed: '200/Day', min: 50, max: 5000, avgTime: '48 Hours', guarantee: '30 Days', provider: 'USAGrowth', region: 'USA' },
    { id: '603', type: 'Likes', name: 'LinkedIn Post Likes', price: 8.00, per: 1000, speed: 'Fast', min: 50, max: 5000, avgTime: '2 Hours', guarantee: 'Non-Drop', provider: 'BizGrow', region: 'Global' },
  ]},
  { category: 'Twitch', group: 'Media', icon: 'fa-brands fa-twitch', color: '#9146FF', items: [
    { id: '1001', type: 'Followers', name: 'Twitch Followers', price: 1.80, per: 1000, speed: 'Fast', min: 100, max: 50000, avgTime: '4 Hours', guarantee: 'Non-Drop', provider: 'StreamKing', region: 'Global' },
    { id: '1002', type: 'Live', name: 'Twitch Live Views [60 Min]', price: 15.00, per: 1000, speed: 'Instant', min: 50, max: 5000, avgTime: '2 Mins', guarantee: 'Concurrent', provider: 'LiveBoost', region: 'Global' },
  ]},
  { category: 'Website Traffic', group: 'Web', icon: 'fa-solid fa-globe', color: '#4F46E5', items: [
    { id: '1401', type: 'Traffic', name: 'Google Organic Search Traffic [USA]', price: 1.50, per: 1000, speed: 'Variable', min: 1000, max: 1000000, avgTime: '24 Hours', guarantee: 'Analytics', provider: 'TrafficSource', region: 'USA' },
    { id: '1402', type: 'Traffic', name: 'Direct Traffic [Global]', price: 0.80, per: 1000, speed: 'Fast', min: 1000, max: 5000000, avgTime: '12 Hours', guarantee: 'Analytics', provider: 'TrafficSource', region: 'Global' },
    { id: '1403', type: 'Traffic', name: 'Mobile Traffic [Android/iOS]', price: 2.20, per: 1000, speed: 'Variable', min: 1000, max: 500000, avgTime: '24 Hours', guarantee: 'Analytics', provider: 'AppFlow', region: 'Global' },
  ]},
  { category: 'Reviews', group: 'Web', icon: 'fa-solid fa-star', color: '#F59E0B', items: [
    { id: '1501', type: 'Reviews', name: 'Google Maps Reviews [5 Star + Text]', price: 150.00, per: 100, speed: 'Drip Feed', min: 5, max: 1000, avgTime: 'Manual', guarantee: '30 Days', provider: 'LocalRank', region: 'Global' },
    { id: '1502', type: 'Reviews', name: 'Trustpilot Reviews [Verified]', price: 250.00, per: 100, speed: 'Slow', min: 5, max: 500, avgTime: 'Manual', guarantee: '30 Days', provider: 'ReviewPro', region: 'Global' },
  ]},
];

export const PROXY_DATA = [
  { id: 'webshare', name: 'Social Stack Proxy Node', type: 'Static Residential', provider: 'Webshare', providerIcon: 'fa-solid fa-share-nodes', price: 2.5, unit: 'Proxy/Mo', feature: 'Optimized for Ad Accounts', locations: ['USA', 'UK', 'CA'], brandColor: '#2563EB' },
  { id: 'kingip', name: 'Global Rotating Residential', type: 'Residential', provider: 'KingIP', providerIcon: 'fa-solid fa-crown', price: 4.0, unit: 'GB', feature: 'Bypass Platform Detection', locations: ['Global'], brandColor: '#F59E0B' },
  { id: 'brightdata', name: 'Premium Mobile 4G', type: 'Mobile', provider: 'BrightData', providerIcon: 'fa-solid fa-signal', price: 12.0, unit: 'GB', feature: 'Real User Devices', locations: ['USA', 'DE', 'FR'], brandColor: '#10B981' },
  { id: 'iproyal', name: 'Datacenter Mix', type: 'Datacenter', provider: 'IPRoyal', providerIcon: 'fa-solid fa-server', price: 1.5, unit: 'Proxy/Mo', feature: 'High Speed', locations: ['USA', 'UK', 'SG', 'JP'], brandColor: '#8B5CF6' },
  { id: 'smartproxy', name: 'Residential Proxies', type: 'Residential', provider: 'SmartProxy', providerIcon: 'fa-solid fa-globe', price: 5.5, unit: 'GB', feature: '195+ Locations', locations: ['Global', 'USA', 'UK', 'IN'], brandColor: '#EC4899' },
  { id: 'oxylabs', name: 'Data Center Dedicated', type: 'Datacenter', provider: 'Oxylabs', providerIcon: 'fa-solid fa-building-shield', price: 2.0, unit: 'IP/Mo', feature: 'Unlimited Bandwidth', locations: ['USA', 'DE', 'NL'], brandColor: '#EF4444' }
];

export const OTP_DATA = [
  { id: 'whatsapp', name: 'WhatsApp Business', icon: 'fa-whatsapp', countries: ['USA', 'UK', 'BD', 'RU', 'IN', 'CN', 'BR', 'ID'], price: 1.20 },
  { id: 'google', name: 'Google Ads Account', icon: 'fa-google', countries: ['USA', 'UK', 'PL', 'DE', 'FR', 'CA', 'AU'], price: 0.85 },
  { id: 'facebook', name: 'Facebook', icon: 'fa-facebook', countries: ['USA', 'UK', 'TR', 'VN', 'PH'], price: 0.50 },
  { id: 'telegram', name: 'Telegram', icon: 'fa-telegram', countries: ['RU', 'UA', 'KZ', 'US', 'ID'], price: 0.40 },
  { id: 'openai', name: 'OpenAI / ChatGPT', icon: 'fa-robot', countries: ['USA', 'UK', 'FR', 'DE'], price: 1.00 }
];

export const RDP_SERVICES_DATA = [
  { name: 'Entry Node', provider: 'DigitalOcean', providerIcon: 'fa-brands fa-digital-ocean', cpu: '2 Core', ram: '2GB', storage: '40GB SSD', price: 9, region: 'Global-1', brandColor: '#0080FF' },
  { name: 'Starter Node', provider: 'Linode', providerIcon: 'fa-brands fa-linux', cpu: '4 Core', ram: '4GB', storage: '60GB SSD', price: 15, region: 'USA-Central', brandColor: '#02f202' },
  { name: 'Starter Pro', provider: 'Vultr', providerIcon: 'fa-solid fa-server', cpu: '4 Core', ram: '8GB', storage: '80GB SSD', price: 19, region: 'USA-East', brandColor: '#007bfc' },
  { name: 'Growth Station', provider: 'AWS', providerIcon: 'fa-brands fa-aws', cpu: '8 Core', ram: '16GB', storage: '160GB NVMe', price: 35, region: 'Germany-Frankfurt', brandColor: '#FF9900' },
  { name: 'Scale Master', provider: 'Google Cloud', providerIcon: 'fa-brands fa-google', cpu: '16 Core', ram: '32GB', storage: '320GB NVMe', price: 69, region: 'UK-London', brandColor: '#4285F4' },
  { name: 'Elite Performance', provider: 'Azure', providerIcon: 'fa-brands fa-microsoft', cpu: '32 Core', ram: '64GB', storage: '500GB NVMe', price: 119, region: 'Low Latency Hub', brandColor: '#0078D4' },
  { name: 'Power Core', provider: 'AWS', providerIcon: 'fa-brands fa-aws', cpu: '64 Core', ram: '128GB', storage: '1TB NVMe', price: 199, region: 'Dedicated Port', brandColor: '#FF9900' },
  { name: 'Titan Node', provider: 'Google Cloud', providerIcon: 'fa-brands fa-google', cpu: '96 Core', ram: '256GB', storage: '2TB NVMe', price: 289, region: 'Dedicated High BW', brandColor: '#4285F4' },
  { name: 'Quantum Core', provider: 'Azure', providerIcon: 'fa-brands fa-microsoft', cpu: '128 Core', ram: '512GB', storage: '4TB NVMe', price: 549, region: 'Ultra-High Density', brandColor: '#0078D4' }
];
