import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  Plan,
  GenerationRequest,
  GenerationResponse,
  User,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/${API_VERSION}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.accessToken);
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data!;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await this.client.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data!;
  }

  async getMe(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.client.post('/auth/change-password', { currentPassword, newPassword });
  }

  // User endpoints
  async getProfile(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/user/profile');
    return response.data.data!;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>('/user/profile', data);
    return response.data.data!;
  }

  async getStats(): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>('/user/stats');
    return response.data.data!;
  }

  // Plans endpoints
  async getPlans(): Promise<Plan[]> {
    const response = await this.client.get<ApiResponse<Plan[]>>('/plans');
    return response.data.data!;
  }

  async getPlanById(id: number): Promise<Plan> {
    const response = await this.client.get<ApiResponse<Plan>>(`/plans/${id}`);
    return response.data.data!;
  }

  async getPlanBySlug(slug: string): Promise<Plan> {
    const response = await this.client.get<ApiResponse<Plan>>(`/plans/slug/${slug}`);
    return response.data.data!;
  }

  // Generation endpoints
  async generateLandingPage(request: GenerationRequest): Promise<GenerationResponse> {
    const response = await this.client.post<ApiResponse<GenerationResponse>>(
      '/generate',
      request
    );
    return response.data.data!;
  }

  async getGenerationHistory(): Promise<any[]> {
    const response = await this.client.get<ApiResponse<any[]>>('/generate/history');
    return response.data.data!;
  }

  async getGenerationById(id: string): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(`/generate/${id}`);
    return response.data.data!;
  }
}

export const api = new ApiClient();
export default api;
