'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { store,persistor } from '@/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from '@/components/Loading'


export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
 
  return <Provider store={store}>
     <PersistGate loading={<Loading />} persistor={persistor}>
    {children}
     </PersistGate>

    </Provider>
}