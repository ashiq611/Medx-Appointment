// src/app/branches/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetBranchDoctorsQuery } from '@/store/services/api/doctorApi';
import { motion } from 'framer-motion';

export default function BranchDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetBranchDoctorsQuery(id as string);

  if (isLoading) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data?.data?.map((doctor: any) => (
        <motion.div
          key={doctor.doctorid}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer bg-white p-4 rounded-2xl shadow-lg"
          onClick={() => router.push(`/doctor/${doctor.doctorid}`)}
        >
          <h2 className="text-lg font-semibold">{doctor.doctorName}</h2>
          <p className="text-gray-500">{doctor.specialtyname}</p>
          <p className="text-sm">{doctor.contactinformation}</p>
          <p className="text-sm italic text-gray-600">
            {doctor.departmentname}, {doctor.hospitalname} ({doctor.branchname})
          </p>
        </motion.div>
      ))}
    </div>
  );
}
