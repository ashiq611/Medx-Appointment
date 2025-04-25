// import { useAuthStore } from '@/store/useStore';
import { useUserInfoQuery } from '@/store/services/api/authApi';
import { UserloggedIn } from '@/store/services/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { useEffect, useState } from 'react';

export function withAuth(Component: any) {
  return function AuthHOC(props: any) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { data: user, isSuccess } = useUserInfoQuery(); 

    useEffect(() => {
      if (isSuccess && user?.data) {
        dispatch(UserloggedIn({
          user: {
            id: user.data.id,
            role: user.data.role,
            is_mfa_active: user.data.is_mfa_active,
            name: user.data.name,
            phone_number: user.data.phone_number
          },
          token: user.data.token
        }));
      }
    }, [isSuccess, user, dispatch]);

    console.log("🚀 ~ file: withAuth.tsx:12 ~ AuthHOC ~ user:", user);

    return <Component {...props} />;
  };
}
