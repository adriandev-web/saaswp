// Common types and interfaces

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'suspended' | 'cancelled';
}

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  companyName?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// JWT Payload
export interface JWTPayload {
  sub: string; // user id
  email: string;
  plan?: string;
  iat: number;
  exp: number;
}

// API Key types
export interface ApiKey {
  id: string;
  userId: string;
  keyPrefix: string;
  name?: string;
  lastUsedAt?: Date;
  createdAt: Date;
  isActive: boolean;
  totalRequests: number;
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

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  planId: number;
  stripeSubscriptionId?: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
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

export interface GenerationResponse {
  generationId: string;
  content: {
    headline: string;
    subheadline: string;
    benefits: string[];
    ctaText: string;
    testimonial: {
      quote: string;
      author: string;
    };
    htmlTemplate: string;
  };
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

// Usage types
export interface UsageLimits {
  userId: string;
  periodStart: Date;
  periodEnd: Date;
  generationsCount: number;
  generationsLimit: number;
  aiTokensUsed: number;
}
