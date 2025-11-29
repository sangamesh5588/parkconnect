// Simple auth utilities for demo purposes
// In a real app, this would integrate with your authentication system

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'renter' | 'host';
}

// Mock user data
const mockUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+919876543210',
  role: 'renter'
};

export class AuthService {
  private static readonly AUTH_KEY = 'parkconnect_auth';

  static isAuthenticated(): boolean {
    // Check if user is logged in (mock implementation)
    const authData = localStorage.getItem(this.AUTH_KEY);
    return authData !== null;
  }

  static getCurrentUser(): User | null {
    if (this.isAuthenticated()) {
      return mockUser;
    }
    return null;
  }

  static login(user: User): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
  }

  static logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  static redirectToLogin(returnUrl?: string): void {
    const loginUrl = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login';
    window.location.href = loginUrl;
  }
}

// Convenience functions
export const isLoggedIn = () => AuthService.isAuthenticated();
export const getCurrentUser = () => AuthService.getCurrentUser();
export const login = (user: User) => AuthService.login(user);
export const logout = () => AuthService.logout();
export const redirectToLogin = (returnUrl?: string) => AuthService.redirectToLogin(returnUrl);
