// src/app/branches/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetBranchDoctorsQuery } from '@/store/services/api/doctorApi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Loading from '@/components/Loading';
import { useState } from 'react';
import Modal from '@/components/modal';
import CreateBranchForm from '@/components/CreateBranch';

export default function BranchDetailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading } = useGetBranchDoctorsQuery(id as string);

  if (isLoading) return <Loading />;

  const handleSubmit = async (data: { [key: string]: any }) => {
    try {
      // await axios.post('/api/branches', data); // Adjust this endpoint accordingly
      alert('Branch added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add branch');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold mb-6 text-center">Doctor List</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-1 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
      >
        Add Doctor
      </button>

      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data?.data?.map((doctor: any) => (
        <motion.div
          key={doctor.doctorid}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer bg-white p-4 rounded-2xl shadow-lg"
          onClick={() => {
            if (user.role === 'Patient') {
              router.push(`/home/doctor/${doctor.doctorid}`);
            } else {
              router.push(`/home/doctor/hospital/${doctor.doctorid}`);
            }
          }}
          // onClick={() => router.push(`/doctor/${doctor.doctorid}`)}
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
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
           <CreateBranchForm onSubmit={handleSubmit}/>
          </Modal>
    </div>
  );
}
