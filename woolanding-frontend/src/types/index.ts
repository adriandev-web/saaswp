// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'suspended' | 'cancelled';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  companyName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Plan types
export interface Plan {
  id: number;
  name: string;
  slug: string;
  description?: string;
  priceMonthly: number;
  priceYearly?: number;
  generationLimit: number;
  features: Record<string, any>;
  isActive: boolean;
}

// Generation types
export interface ProductData {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  sku?: string;
}

export interface GenerationRequest {
  product: ProductData;
  options?: {
    template?: string;
    tone?: 'professional' | 'casual' | 'enthusiastic';
    language?: string;
  };
}

export interface GenerationContent {
  headline: string;
  subheadline: string;
  benefits: string[];
  ctaText: string;
  testimonial: {
    quote: string;
    author: string;
  };
  htmlTemplate: string;
}

export interface GenerationResponse {
  generationId: string;
  content: GenerationContent;
  usage: {
    generationsUsed: number;
    generationsRemaining: number;
    resetDate: string;
  };
  metadata: {
    processingTimeMs: number;
    tokensUsed: number;
  };
}
