import axiosInstance from "./axios"

export const loginUser = async (phone_number: string, password: string) => {
    const res = await axiosInstance.post('/auth/login', { phone_number, password })
    return res.data
  }
  

  export const verifyOtp = async (token: string) => {
    const res = await axiosInstance.post('/auth/2fa/verify', { token })
    return res.data
  }

  
  export const checkAuth = async () => {
    const res = await axiosInstance.get('/auth/status')
    return res.data
  }

  
  export const logout = async () => {
    const res = await axiosInstance.post('/auth/logout')
    return res.data
  }
export const resendOtp = async () => {
    const res = await axiosInstance.post('/auth/resend-otp')
    return res.data
  }
  
  
  