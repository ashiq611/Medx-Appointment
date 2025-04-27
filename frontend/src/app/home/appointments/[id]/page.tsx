'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useGetAppointmentsQuery } from '@/store/services/api/appointmentApi';

export default function DoctorAppointmentsPage() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = selectedDate.toISOString().split('T')[0];

  const { data, isLoading, error } = useGetAppointmentsQuery({
    doctorId: id as string,
    date: formattedDate,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
        >
          Print
        </button>
      </div>

     <div className="relative mb-4">
  <DatePicker
    selected={selectedDate}
    onChange={(date: Date | null) => date && setSelectedDate(date)}
    dateFormat="yyyy-MM-dd"
    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 shadow-md transition-all duration-300 placeholder-gray-400"
    placeholderText="Select a date"
  />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 19h14M5 15h14" />
  </svg>
</div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Serial</th>
            <th className="border p-2">Patient Name</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((appointment: any) => (
          <motion.tr
          key={appointment.appointmentid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "#e0f7fa",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            y: -3,
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="border-b cursor-pointer"
        >
          <td className="border p-2">{appointment.appointmentserialnumber}</td>
          <td className="border p-2">{appointment.patientname}</td>
          <td className="border p-2">{appointment.patientcontact}</td>
          <td className="border p-2">{appointment.status}</td>
        </motion.tr>
        
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
