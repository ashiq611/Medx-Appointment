// hoc/withAuth.tsx
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { RootState } from '@/services/store'

export const withAuth = (Component: any) => {
  return (props: any) => {
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
    const router = useRouter()

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/login')
      }
    }, [loading, isAuthenticated])

    if (loading) return <p>Loading...</p>
    if (!isAuthenticated) return null

    return <Component {...props} />
  }
}
