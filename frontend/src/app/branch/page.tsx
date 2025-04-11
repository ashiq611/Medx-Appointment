'use client';

import { useHospitalStore } from "@/store/useHospitalStore"
import { useEffect } from "react"


const Branch = () => {

   const { fetchBranches }  = useHospitalStore((state) => (state))

useEffect(() => {
  fetchBranches();
}, [])


  return (
    <>
        <h1>Branch</h1>
        <p>Branch page content goes here.</p>
    </>
  )
}

export default Branch