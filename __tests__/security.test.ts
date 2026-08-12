import { checkUsernameExists, checkRegistrationNumberExists } from '@/api/Profile';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          maybeSingle: jest.fn(),
          count: jest.fn()
        }))
      }))
    }))
  }
}));

describe('Security Layer Checks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Uniqueness Check RPCs', () => {
    it('should call check_username_exists RPC', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: true, error: null });
      const result = await checkUsernameExists('testuser');
      expect(supabase.rpc).toHaveBeenCalledWith('check_username_exists', { username_to_check: 'testuser' });
      expect(result).toBe(true);
    });

    it('should call check_registration_exists RPC', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: false, error: null });
      const result = await checkRegistrationNumberExists('12345');
      expect(supabase.rpc).toHaveBeenCalledWith('check_registration_exists', { reg_to_check: 12345 });
      expect(result).toBe(false);
    });
  });
});
