import { jobsApi } from './api';

const API_BASE_URL = 'http://localhost:3002/api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'hr_manager' | 'hr_staff' | 'interviewer';
  firstName: string;
  lastName: string;
  department: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = localStorage.getItem('authToken');
  private user: User | null = JSON.parse(localStorage.getItem('authUser') || 'null');

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      this.setAuth(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        this.user = user;
        return user;
      } else {
        this.clearAuth();
        return null;
      }
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  async updateProfile(updateData: Partial<User>): Promise<User> {
    if (!this.token || !this.user) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${this.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Update failed');
      }

      const updatedUser = await response.json();
      this.user = updatedUser;
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.token || !this.user) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${this.user.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password change failed');
      }
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  hasRole(roles: string[]): boolean {
    return this.user ? roles.includes(this.user.role) : false;
  }

  hasPermission(resource: string, action: string): boolean {
    if (!this.user) return false;
    
    // Admin has all permissions
    if (this.user.role === 'admin') return true;
    
    // HR Manager has most permissions
    if (this.user.role === 'hr_manager') {
      return ['jobs', 'candidates', 'applications', 'interviews', 'users'].includes(resource);
    }
    
    // HR Staff has basic permissions
    if (this.user.role === 'hr_staff') {
      return ['jobs', 'candidates', 'applications'].includes(resource);
    }
    
    // Interviewer has limited permissions
    if (this.user.role === 'interviewer') {
      return ['interviews'].includes(resource);
    }
    
    return false;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  private setAuth(authData: AuthResponse): void {
    this.token = authData.token;
    this.user = authData.user;
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('authUser', JSON.stringify(authData.user));
  }

  private clearAuth(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
}

export const authService = new AuthService();

// Enhanced API service with authentication
export const authenticatedApi = {
  request: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const token = authService.getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    if (response.status === 401) {
      authService.clearAuth();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  get: <T>(endpoint: string): Promise<T> => authenticatedApi.request<T>(endpoint),
  
  post: <T>(endpoint: string, data: any): Promise<T> => 
    authenticatedApi.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any): Promise<T> => 
    authenticatedApi.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string): Promise<T> => 
    authenticatedApi.request<T>(endpoint, {
      method: 'DELETE',
    }),
}; 