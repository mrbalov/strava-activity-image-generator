'use client';

import { useCallback } from 'react';
import { LogOut } from 'lucide-react';

import { logout } from '@/utils/auth';
import { useQueryAuthStatus } from '@/api/strava';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/molecules/ThemeSwitcher';

/**
 * Header actions.
 * Handles authentication state, logout, and theme switching.
 * @returns {JSX.Element} HeaderActions component.
 */
const HeaderActions = () => {
  const authStatusData = useQueryAuthStatus();
  const isLogoutButtonVisible = (
    !authStatusData.isLoading
    && authStatusData.data
  );

  /**
   * Handles user logout.
   * @returns {void}
   */
  const handleLogout = useCallback(() => {
    logout().catch(console.error);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {isLogoutButtonVisible && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut />
        </Button>
      )}
      <ThemeSwitcher />
    </div>
  );
};

export default HeaderActions;
