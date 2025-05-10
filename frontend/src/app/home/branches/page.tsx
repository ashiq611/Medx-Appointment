"use client";


import { branchFields, RoleNamesEnum } from "@/app/constant/formFeilds";
import CreateBranchForm from "@/components/CreateBranch";
import DynamicForm from "@/components/DynamicForm";
import Loading from "@/components/Loading";
import Modal from "@/components/modal";
import { useAddBranchMutation, useGetBranchesQuery } from "@/store/services/api/hospitalApi";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function BranchList() {
    const router = useRouter();
       const { user } = useSelector((state: any) => state.auth);
  const { data: branches, isLoading, error } = useGetBranchesQuery();
  const [addBranch, { isLoading: isAdding } ] = useAddBranchMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500 text-center py-10">Failed to load branches</p>;


  const handleClick = (id: string) => {
    router.push(`/home/branches/${id}`);
  };

  const handleSubmit = async (data: { [key: string]: any }) => {
    try {
      const finalData = {
        ...data,
        HospitalID: "2f7cc464-bcb9-4dab-908e-27b84e1e46d4"
      }
      await addBranch(finalData)
      .then(() => {
        setIsModalOpen(false);
        toast.success('Branch added successfully!')
      })
    } catch (error) {
      console.error(error);
      alert('Failed to add branch');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold mb-6 text-center">Hospital Branches</h1>
      {
        RoleNamesEnum.ADMIN === user?.role &&(
          <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-1 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          Add Branch
        </button>
        )
      }
    

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches?.map((branch, i) => (
          <motion.div
            key={branch.hospitalbranchid}
            className="rounded-xl shadow-md bg-white p-6 border hover:shadow-lg transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleClick(branch.hospitalbranchid)}
          >
            <h2 className="text-xl font-semibold">{branch.branchname}</h2>
            <p className="text-gray-700">🏥 {branch.hospitalname}</p>
            <p className="text-gray-600 mt-1">📍 {branch.location}</p>
            <p className="text-gray-600 mt-1">📞 {branch.contactinformation}</p>
            <div className="flex justify-between mt-4">
              <button className="mr-2 bg-red-400">Edit</button>
              <button className="ml-2">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
       <DynamicForm fields={branchFields} onSubmit={handleSubmit} buttonText="Add Branch" headText="Add Branch"/>
      </Modal>
    </div>
  );
}
