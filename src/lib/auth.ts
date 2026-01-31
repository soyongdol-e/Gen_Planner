// Demo user ID for prototype (no authentication)
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// Get current user ID (always returns demo user for prototype)
export const getCurrentUserId = (): string => {
  return DEMO_USER_ID;
};
