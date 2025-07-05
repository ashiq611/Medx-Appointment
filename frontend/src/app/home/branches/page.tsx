"use client";


import { branchFields, RoleNamesEnum } from "@/app/constant/formFeilds";
import DynamicForm from "@/components/DynamicForm";
import Loading from "@/components/Loading";
import Modal from "@/components/modal";
import { withAuth } from "@/hoc/withAuth";
import { useAddBranchMutation, useDeleteBranchMutation, useGetBranchesQuery, useUpdateBranchMutation } from "@/store/services/api/hospitalApi";
import { resetForm } from "@/store/services/slices/formSlice";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function BranchList() {
    const router = useRouter();
       const { user } = useSelector((state: any) => state.auth);
  const { data: branches, isLoading, error } = useGetBranchesQuery();
  const [addBranch ] = useAddBranchMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
const [updateBranch] = useUpdateBranchMutation();
const [deleteBranch] = useDeleteBranchMutation();

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500 text-center py-10">Failed to load branches</p>;


  const handleClick = (id: string) => {
    router.push(`/home/branches/${id}`);
  };

  const handleSubmit = async (data: { [key: string]: any }) => {
    try {
      const finalData = {
        ...data,
        HospitalID: "2f7cc464-bcb9-4dab-908e-27b84e1e46d4", // or from user object if dynamic
      };
  
      if (selectedBranch) {
        await updateBranch({
          ...finalData,
          hospitalbranchid: selectedBranch.hospitalbranchid
        });
        toast.success("Branch updated successfully!");
      } else {
        await addBranch(finalData);
        toast.success("Branch added successfully!");
      }
  
      setIsModalOpen(false);
      setSelectedBranch(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit form.");
    }
  };
  
  const openDeleteModal = (e: React.MouseEvent, branchId: string) => {
    e.stopPropagation(); // Prevent card navigation
    setDeleteTargetId(branchId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
  
    try {
      await deleteBranch(deleteTargetId)
      toast.success("Branch deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete branch.");
      console.error(error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Hospital Branches</h1>
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
            <h2 className="text-xl font-semibold text-teal-800">{branch.branchname}</h2>
            <p className="text-gray-700">🏥 {branch.hospitalname}</p>
            <p className="text-gray-600 mt-1">📍 {branch.location}</p>
            <p className="text-gray-600 mt-1">📞 {branch.contactinformation}</p>
            <div className="flex justify-between mt-4">
            <button
  onClick={(e) => {
    e.stopPropagation(); // ✅ stop box click
    setSelectedBranch(branch);
    setIsModalOpen(true);
  }}
  className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded"
>
  Edit
</button>
<button
  className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
  onClick={(e) => openDeleteModal(e, branch.hospitalbranchid)}
>
  Delete
</button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
  <div className="p-4">
    <h2 className="text-xl font-semibold text-center mb-4">Confirm Delete</h2>
    <p className="text-gray-700 text-center mb-6">
      Are you sure you want to delete this branch? This action cannot be undone.
    </p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => setDeleteModalOpen(false)}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button
        onClick={handleConfirmDelete}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  </div>
</Modal>

      <Modal isOpen={isModalOpen} onClose={() => {
  setIsModalOpen(false);
  setSelectedBranch(null);
}}>
  <DynamicForm
    fields={branchFields}
    onSubmit={handleSubmit}
    initialValues={selectedBranch ?? undefined}
    buttonText={selectedBranch ? "Update Branch" : "Add Branch"}
    headText={selectedBranch ? "Edit Branch" : "Add Branch"}
  />
</Modal>
    </div>
  );
}


export default withAuth(BranchList);
