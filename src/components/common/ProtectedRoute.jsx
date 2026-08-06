'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useSelector } from '@/store/hooks';
import { Spinner } from '@/components/ui/Spinner';

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const token  = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  // Token is hydrated synchronously from localStorage in authSlice initialState,
  // so if it's present on the first render we can show the page immediately.
  if (!token) {
    return (
      <div className="flex items-center justify-center py-xl">
        <Spinner />
      </div>
    );
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
