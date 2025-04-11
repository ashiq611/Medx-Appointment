import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { checkAuth, loginUser } from '@/api/api';

interface User {
  id: string | null;
  name: string | null;
  phone_number: string | null;
  role: string | null;
  is_mfa_active: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  jwtToken: string | null;
  setUser: (user: User) => void;
  setAuthStatus: (status: boolean) => void;
  setLoading: (loading: boolean) => void;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
  setJwtToken: (token: string) => void;
  checkAuth: () => Promise<void>;
}

interface FormState {
  formData: { [key: string]: string };
  setFormValue: (name: string, value: string) => void;
  resetFormData: () => void;
}

// Apply devtools to useAuthStore and useFormStore
export const useAuthStore = create<AuthState>()(
  devtools(persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      jwtToken: null,
      setUser: (user: User) => set({ user, isAuthenticated: true, loading: false }),
      setAuthStatus: (status: boolean) => set({ isAuthenticated: status }),
      setLoading: (loading: boolean) => set({ loading }),
      setJwtToken: (token: string) => set({ jwtToken: token }),

      // API call to handle login
      login: async (phoneNumber: string, password: string) => {
        set({ loading: true });
        try {
          const response = await loginUser(phoneNumber, password);
          const userData = response.data;
          const { token, ...restUserData } = userData;

          set({
            user: restUserData,
            jwtToken: token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          set({ loading: false });
          console.error('Login failed:', err);
        }
      },

      checkAuth: async () => {
        // set({ loading: true });
        try {
          const response = await checkAuth();
          if (!response.success) {
            set({
              user: null,
              isAuthenticated: false,
              jwtToken: null,
              loading: false,
            });
            localStorage.removeItem('auth-store');
          }
          console.log('checkauth:', response.success);

          // set({ loading: false });
        } catch (err) {
          console.error('Check auth failed:', err);
          set({ loading: false });
        }
      },

      // Logout functionality
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          jwtToken: null,
          loading: false,
        });

        // Remove from localStorage
        localStorage.removeItem('auth-store');
      },
    }),
    {
      name: 'auth-store', // localStorage key
      partialize: (state) => ({
        user: state.user,
        jwtToken: state.jwtToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  ))
);

export const useFormStore = create<FormState>()(
  devtools((set) => ({
    formData: {},
    setFormValue: (name, value) =>
      set((state) => ({
        formData: { ...state.formData, [name]: value },
      })),
    resetFormData: () => set({ formData: {} }),
  }))
);



// export const useHospitalStore = create<FormState>()(
//   devtools((set) => ({
//     formData: {},
//     setFormValue: (name, value) =>
//       set((state) => ({
//         formData: { ...state.formData, [name]: value },
//       })),
//     resetFormData: () => set({ formData: {} }),
//   }))
// );


