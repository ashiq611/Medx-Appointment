import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function withAuth(Component: any) {
  return function AuthHOC(props: any) {
    const { isAuthenticated, loading,checkAuth } = useAuthStore((state) => state);
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      // Ensure we only proceed once hydration is done
      if (!loading && isAuthenticated !== null) {
        setIsHydrated(true);
      }
    }, [loading, isAuthenticated]);

    // Redirect logic after hydration and check for authentication
    useEffect(() => {
      // checkAuth(); // Check authentication status on mount
      if (isHydrated && !loading && !isAuthenticated) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    }, [isHydrated, loading, isAuthenticated, router]);

    // Handle loading and hydration status
    if (!isHydrated || loading) {
      return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
      return null; // or show a loading indicator until hydration completes
    }

    return <Component {...props} />;
  };
}
