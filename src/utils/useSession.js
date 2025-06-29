// utils/useSession.js
import { useEffect, useState } from 'react';
import { CheckUser } from './session';

export default function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const sessionUser = await CheckUser();
        setUser(sessionUser);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { user, loading, setUser };
}