'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DynamicForm from '@/components/DynamicForm';
import axios from 'axios';
import { doctorFields } from '@/app/constant/formFeilds';

const DoctorAddPage = () => {
  const handleSubmit = async (data: { [key: string]: any }) => {
    try {
      await axios.post('/api/doctors', data); // Adjust this endpoint accordingly
      alert('Doctor added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add doctor');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Add New Doctor</h2>
        <DynamicForm fields={doctorFields} onSubmit={handleSubmit} buttonText="Add Doctor" />
      </motion.div>
    </motion.div>
  );
};

export default DoctorAddPage;
