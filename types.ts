
export interface PlatformData {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  metrics: {
    label: string;
    value: string | number;
    trend: number;
    unit?: string;
  }[];
}

export interface ROIEntry {
  [key: string]: any;
  platform: string;
  spend: number;
  revenue: number;
  roi: number;
}

export interface ComparisonMetric {
  [key: string]: any;
  subject: string;
  Meta: number;
  TikTok: number;
  Google: number;
  LinkedIn?: number;
  Twitter?: number;
}

export interface PostPayload {
  content: string;
  platforms: string[];
  image?: string;
  scheduledTime?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video' | 'document';
  date: string;
  size?: string;
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  ANALYTICS = 'analytics',
  PUBLISHER = 'publisher',
  AI_INSIGHTS = 'ai-insights',
  BILLING = 'billing',
  INTEGRATIONS = 'integrations',
  BLOG = 'blog',
  AUTH = 'auth',
  SMM_PANEL = 'smm_panel',
  RDP_SERVICES = 'rdp_services',
  OTP_SERVICES = 'otp_services',
  ADD_FUND = 'add_fund',
  CHILD_PANEL = 'child_panel',
  ADMIN_CONTROL = 'admin_control',
  ADMIN_API = 'admin_api',
  SETTINGS = 'settings',
  ENTERTAINMENT = 'entertainment',
  DEPLOYMENT = 'deployment',
  FILES = 'files',
  COMMUNICATIONS = 'communications',
  LEARN_EARN = 'learn_earn',
  PLATFORM_META = 'platform_meta',
  PLATFORM_TIKTOK = 'platform_tiktok',
  PLATFORM_TWITTER = 'platform_twitter',
  PLATFORM_LINKEDIN = 'platform_linkedin',
  PLATFORM_YOUTUBE = 'platform_youtube',
  PLATFORM_PINTEREST = 'platform_pinterest',
  NEWS = 'news'
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  recommended?: boolean;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
  balance: number;
  avatar?: string;
  currency: string;
  language?: string;
  twoFactorEnabled: boolean;
}
