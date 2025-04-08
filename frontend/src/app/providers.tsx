"use client";

import { checkAuth } from "@/api/api";
import { setUser } from "@/services/slices/authSlice";
import { store } from "@/services/store";
import { ReactNode, useEffect } from "react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";


function AppInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const { authenticate, ...user } = await checkAuth();
        if (authenticate) {
          dispatch(setUser(user));
        } else {
          dispatch(setUser(null));
        }
      } catch (err) {
        dispatch(setUser(null));
      }
    };

    fetchAuth();
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AppInit />
      {children}
    </ReduxProvider>
  );
}
