// src/app/doctors/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useGetDoctorDetailsQuery } from '@/store/services/api/doctorApi';
import { motion } from 'framer-motion';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const { data, isLoading } = useGetDoctorDetailsQuery(id as string);

  if (isLoading) return <p className="p-6">Loading doctor profile...</p>;

  const doctor = data?.data;

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-2">{doctor.doctorName}</h2>
      <p className="text-gray-600 mb-1">Specialty: {doctor.specialtyname}</p>
      <p className="text-gray-600 mb-1">Department: {doctor.departmentname}</p>
      <p className="text-gray-600 mb-1">Branch: {doctor.branchname}</p>
      <p className="text-gray-600 mb-4">Contact: {doctor.contactinformation}</p>
      <hr className="my-4" />

      <h3 className="text-lg font-semibold mb-2">Schedule</h3>
      {doctor.scheduleList.length === 0 ? (
        <p>No schedules available.</p>
      ) : (
        doctor.scheduleList.map((slot: any) => (
          <motion.div
            key={slot.scheduleid}
            className="bg-gray-100 p-3 rounded-lg mb-2"
            whileHover={{ scale: 1.02 }}
          >
            <p><strong>Day:</strong> {slot.day}</p>
            <p><strong>Time:</strong> {slot.startslot} - {slot.endslot}</p>
            <p><strong>Status:</strong> {slot.availability}</p>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
