import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  user: null | {
    id: number
    role: string
    phone_number: string
    is_mfa_active: boolean
  }
  loading: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState['user']>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.loading = false
    },
    logoutUser(state) {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    }
  }
})

export const { setUser, logoutUser, setLoading } = authSlice.actions
export default authSlice.reducer
