// store/useHospitalStore.ts
import { getAllHospitals } from '@/api/api';
import axiosInstance from '@/api/axios';
import { get } from 'http';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface HospitalBranch {
  hospitalbranchid: string;
  hospitalid: string;
  branchname: string;
  location: string;
  contactinformation: string;
  hospitalname: string;
}

interface HospitalStore {
  branches: HospitalBranch[];
  fetchBranches: () => Promise<void>;
  setBranches: (branches: HospitalBranch[]) => void;
  addBranch: (branch: HospitalBranch) => void;
  resetBranches: () => void;
}

export const useHospitalStore = create<HospitalStore>()(
  devtools(
    // persist(
      (set) => ({
        branches: [],

        fetchBranches: async () => {
          try {
            const response = await getAllHospitals();
            const branches = response.data;
            console.log('Fetched branches:', branches);
            set({ branches });
          } catch (error) {
            console.error('Error fetching branches:', error);
            // Handle error (e.g., show a notification)
          }
        },
           

        setBranches: (branches) => set({ branches }),

        addBranch: (branch) =>
          set((state) => ({
            branches: [...state.branches, branch],
          })),

        resetBranches: () => set({ branches: [] }),
      }),
      // {
      //   name: 'hospital-store', // key in localStorage
      // }
    // )
  )
);
