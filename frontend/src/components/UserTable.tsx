"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import DynamicForm from "./DynamicForm";
import Modal from "./modal";
import { userFields } from "@/app/constant/formFeilds";
import { useAddUserMutation } from "@/store/services/api/hospitalApi";
import { toast } from "react-toastify";

interface User {
  name: string;
  role: string;
  phone_number: string;
  contactinformation: string;
}

interface Props {
  admins: User[];
  receptionists: User[];
}

export const UserTable: React.FC<Props> = ({
  admins,
  receptionists
}) => {
  const users = [...admins, ...receptionists];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addUser]= useAddUserMutation();

  const handleSubmit = async (data: { [key: string]: any }) => {
    try {
      await addUser(data)
      .then(() => {
        setIsModalOpen(false);
        toast.success('User added successfully!')
      })
    } catch (error) {
      console.error(error);
      alert("Failed to add User");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-800">User List</h2>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add User
        </button>
      </div>

      <motion.table
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-left border border-gray-200 shadow-md rounded"
      >
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b text-teal-800">Name</th>
            <th className="p-3 border-b text-teal-800">Role</th>
            <th className="p-3 border-b text-teal-800">Phone</th>
            <th className="p-3 border-b text-teal-800">Contact Info</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-3 text-black">{user.name}</td>
              <td className="p-3 text-cyan-800">{user.role}</td>
              <td className="p-3 text-black">{user.phone_number}</td>
              <td className="p-3 text-black">{user.contactinformation}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
       <DynamicForm fields={userFields} onSubmit={handleSubmit} buttonText="Add User" headText="Add User"/>
      </Modal>
    </div>
  );
};
