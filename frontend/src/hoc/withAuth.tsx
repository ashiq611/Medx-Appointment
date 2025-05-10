import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useUserInfoQuery } from "@/store/services/api/authApi";
import { UserloggedIn, UserloggedOut } from "@/store/services/slices/authSlice";

export function withAuth(Component: any) {
  return function AuthHOC(props: any) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: any) => state.auth);

    // Call auth status API
    const { data, error, isSuccess } = useUserInfoQuery();

    useEffect(() => {
      // If Unauthorized error comes from API
      if (error && "status" in error && error.status === 401) {
        dispatch(UserloggedOut());
        router.push("/login");
      }

      // If user is authenticated from server
      if (isSuccess && data?.data?.authenticate) {
        dispatch(
          UserloggedIn({
            user: {
              id: data.data.id,
              role: data.data.role,
              is_mfa_active: data.data.is_mfa_active,
              name: data.data.name,
              phone_number: data.data.phone_number,
              personalId: data.data.personalId,
            },
            token: null, // no token provided by status endpoint
          })
        );
      }
    }, [error, isSuccess, data, dispatch, router]);

    // Prevent early render if auth state isn't resolved yet
    if (!isAuthenticated && !isSuccess) return null;

    return <Component {...props} />;
  };
}
