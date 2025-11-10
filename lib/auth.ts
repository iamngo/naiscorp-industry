// Authentication utilities (mock for MVP)
import { User, UserRole } from '@/types/database';

export interface AuthSession {
  user: User;
  token: string;
}

// Mock authentication - trong production sẽ dùng JWT thật
export const mockAuth = {
  login: async (email: string, password: string): Promise<AuthSession | null> => {
    // Mock login - trong production sẽ verify password hash
    const mockUsers: Record<string, { user: User; password: string }> = {
      'admin@naiscorp.vn': {
        user: {
          id: 'user-1',
          email: 'admin@naiscorp.vn',
          passwordHash: '$2b$10$example',
          role: 'admin',
          fullName: 'Admin System',
          phone: '0901234567',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          isActive: true,
        },
        password: 'admin123',
      },
      'dongnama@iz.vn': {
        user: {
          id: 'user-2',
          email: 'dongnama@iz.vn',
          passwordHash: '$2b$10$example',
          role: 'iz',
          fullName: 'Khu Công Nghiệp Đông Nam Á',
          phone: '0274-1234567',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          isActive: true,
        },
        password: 'iz123',
      },
      'vatai@supplier.vn': {
        user: {
          id: 'user-3',
          email: 'vatai@supplier.vn',
          passwordHash: '$2b$10$example',
          role: 'supplier',
          fullName: 'Công ty TNHH Vật liệu Công nghiệp',
          phone: '028-1234567',
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z',
          isActive: true,
        },
        password: 'supplier123',
      },
    };

    const account = mockUsers[email];
    if (account && account.password === password) {
      return {
        user: account.user,
        token: `mock-token-${account.user.id}`,
      };
    }
    return null;
  },

  getCurrentUser: (token: string): User | null => {
    // Mock get user from token
    if (token.startsWith('mock-token-')) {
      const userId = token.replace('mock-token-', '');
      const mockUsers: Record<string, User> = {
        'user-1': {
          id: 'user-1',
          email: 'admin@naiscorp.vn',
          passwordHash: '$2b$10$example',
          role: 'admin',
          fullName: 'Admin System',
          phone: '0901234567',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          isActive: true,
        },
        'user-2': {
          id: 'user-2',
          email: 'dongnama@iz.vn',
          passwordHash: '$2b$10$example',
          role: 'iz',
          fullName: 'Khu Công Nghiệp Đông Nam Á',
          phone: '0274-1234567',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          isActive: true,
        },
        'user-3': {
          id: 'user-3',
          email: 'vatai@supplier.vn',
          passwordHash: '$2b$10$example',
          role: 'supplier',
          fullName: 'Công ty TNHH Vật liệu Công nghiệp',
          phone: '028-1234567',
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z',
          isActive: true,
        },
      };
      return mockUsers[userId] || null;
    }
    return null;
  },
};

export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, ['admin']);
};

