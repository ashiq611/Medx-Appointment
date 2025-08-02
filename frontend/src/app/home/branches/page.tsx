"use client";

import { branchFields, RoleNamesEnum } from "@/app/constant/formFeilds";
import DynamicForm from "@/components/DynamicForm";
import Loading from "@/components/Loading";
import { withAuth } from "@/hoc/withAuth";
import {
  useAddBranchMutation,
  useDeleteBranchMutation,
  useGetBranchesQuery,
  useUpdateBranchMutation
} from "@/store/services/api/hospitalApi";
import { resetForm } from "@/store/services/slices/formSlice";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function BranchList() {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const { data: branches, isLoading, error } = useGetBranchesQuery();
  const [addBranch] = useAddBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500 text-center py-10">Failed to load branches</p>;

  const handleClick = (id: string) => router.push(`/home/branches/${id}`);

  const handleSubmit = async (data: { [key: string]: any }) => {
    try {
      const finalData = {
        ...data,
        HospitalID: "2f7cc464-bcb9-4dab-908e-27b84e1e46d4", // can be dynamic
      };

      if (selectedBranch) {
        await updateBranch({
          ...finalData,
          hospitalbranchid: selectedBranch.hospitalbranchid,
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
    e.stopPropagation();
    setDeleteTargetId(branchId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteBranch(deleteTargetId);
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Hospital Branches</h1>
        {RoleNamesEnum.ADMIN === user?.role && (
          <Button onClick={() => setIsModalOpen(true)}>
            Add Branch
          </Button>
        )}
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
            <Badge className="mb-2 text-xl"variant="outline">{branch.branchname}</Badge>
            <p className="text-gray-700">🏥 {branch.hospitalname}</p>
            <p className="text-gray-600 mt-1">📍 {branch.location}</p>
            <p className="text-gray-600 mt-1">📞 {branch.contactinformation}</p>
            {
              RoleNamesEnum.ADMIN === user?.role && (
                <div className="flex justify-between mt-4">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBranch(branch);
                  setIsModalOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={(e) => openDeleteModal(e, branch.hospitalbranchid)}
              >
                Delete
              </Button>
            </div>
              )
            }
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTitle>{selectedBranch ? "Edit Branch" : "Add Branch"}</DialogTitle>
        <DialogContent>
          <DynamicForm
            fields={branchFields}
            onSubmit={handleSubmit}
            initialValues={selectedBranch ?? undefined}
            buttonText={selectedBranch ? "Update Branch" : "Add Branch"}
            headText={selectedBranch ? "Edit Branch" : "Add Branch"}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this branch? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(BranchList);
