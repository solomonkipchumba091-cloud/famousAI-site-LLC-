// Product Types
export type ProductCategory = 'saas_starter' | 'prompt' | 'ui_kit' | 'cursor_rule';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description?: string;
  category: ProductCategory;
  price_cents: number;
  compare_price_cents?: number;
  image_url?: string;
  gallery_urls?: string[];
  tags?: string[];
  features?: string[];
  tech_stack?: string[];
  demo_url?: string;
  preview_content?: string;
  is_featured: boolean;
  is_published: boolean;
  downloads_count: number;
  rating_average: number;
  rating_count: number;
  seller_id?: string;
  lemon_squeezy_product_id?: string;
  lemon_squeezy_variant_id?: string;
  created_at: string;
  updated_at: string;
}

// User/Profile Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  username?: string;
  bio?: string;
  website?: string;
  github_username?: string;
  is_seller: boolean;
  stripe_customer_id?: string;
  lemon_squeezy_customer_id?: string;
  created_at: string;
  updated_at: string;
}

// Order Types
export type OrderStatus = 'pending' | 'completed' | 'refunded' | 'failed';
export type LicenseType = 'personal' | 'team' | 'enterprise';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_cents: number;
  currency: string;
  lemon_squeezy_order_id?: string;
  lemon_squeezy_subscription_id?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_cents: number;
  license_type: LicenseType;
  created_at: string;
  product?: Product;
}

// Prompt Types
export interface PromptVariable {
  id: string;
  name: string;
  description?: string;
  defaultValue?: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

export interface Prompt {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content_json: Record<string, unknown>;
  compiled_content?: string;
  variables: PromptVariable[];
  is_public: boolean;
  is_forked: boolean;
  forked_from_product_id?: string;
  forked_from_prompt_id?: string;
  run_count: number;
  last_run_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PromptVersion {
  id: string;
  prompt_id: string;
  version_number: number;
  content_json: Record<string, unknown>;
  compiled_content?: string;
  variables: PromptVariable[];
  change_notes?: string;
  created_at: string;
}

// License Types
export interface License {
  id: string;
  user_id: string;
  product_id: string;
  order_item_id?: string;
  license_key: string;
  license_type: LicenseType;
  seats_allowed: number;
  seats_used: number;
  is_active: boolean;
  expires_at?: string;
  activated_at: string;
  created_at: string;
  product?: Product;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  license_type: LicenseType;
}

// Filter Types
export interface ProductFilters {
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
}

// Chat/AI Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// UI State Types
export interface ModalState {
  isOpen: boolean;
  type?: 'auth' | 'cart' | 'product-preview' | 'prompt-runner';
  data?: unknown;
}

// Category metadata
export const CATEGORY_INFO: Record<ProductCategory, { label: string; icon: string; description: string; color: string }> = {
  saas_starter: {
    label: 'SaaS Starters',
    icon: 'Rocket',
    description: 'Production-ready boilerplates to launch your SaaS fast',
    color: 'from-purple-500 to-pink-500'
  },
  prompt: {
    label: 'AI Prompts',
    icon: 'Sparkles',
    description: 'Carefully crafted prompts for AI-powered workflows',
    color: 'from-cyan-500 to-blue-500'
  },
  ui_kit: {
    label: 'UI Kits',
    icon: 'Palette',
    description: 'Beautiful components for your next project',
    color: 'from-green-500 to-emerald-500'
  },
  cursor_rule: {
    label: 'Cursor Rules',
    icon: 'Code2',
    description: 'IDE rules for consistent, high-quality code',
    color: 'from-orange-500 to-yellow-500'
  }
};
