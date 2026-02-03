import { useState, useEffect } from 'react';

const GUEST_KEY = 'team_randomizer_guest_used';

export const useGuestLimit = () => {
  const [hasUsedRandomize, setHasUsedRandomize] = useState(false);

  useEffect(() => {
    const used = localStorage.getItem(GUEST_KEY);
    setHasUsedRandomize(used === 'true');
  }, []);

  const markAsUsed = () => {
    localStorage.setItem(GUEST_KEY, 'true');
    setHasUsedRandomize(true);
  };

  const resetGuestLimit = () => {
    localStorage.removeItem(GUEST_KEY);
    setHasUsedRandomize(false);
  };

  return { hasUsedRandomize, markAsUsed, resetGuestLimit };
};
