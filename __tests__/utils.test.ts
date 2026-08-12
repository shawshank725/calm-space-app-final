import { formatTime, isValidEmail, isValidPhone, truncateText } from '../lib/utils';

describe('Utility Functions', () => {
  describe('formatTime', () => {
    it('should format HH:MM:SS to 12-hour format', () => {
      expect(formatTime('09:00:00')).toBe('9:00 AM');
      expect(formatTime('13:30:00')).toBe('1:30 PM');
      expect(formatTime('00:15:00')).toBe('12:15 AM');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid 10-digit phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('12345678901')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      expect(truncateText('Hello World', 5)).toBe('He...');
    });

    it('should not truncate text shorter than maxLength', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });
  });
});
