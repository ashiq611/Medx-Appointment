// src/app/branches/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAddDoctorMutation, useDeleteDoctorMutation, useGetBranchDoctorsQuery, useUpdateDoctorMutation } from '@/store/services/api/doctorApi';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '@/components/Loading';
import { useState } from 'react';
import Modal from '@/components/modal';
import DynamicForm from '@/components/DynamicForm';
import { useGetSpecilityDepartmentQuery } from '@/store/services/api/hospitalApi';
import { generateDoctorFields, RoleNamesEnum } from '@/app/constant/formFeilds';
import { toast } from 'react-toastify';
import { withAuth } from '@/hoc/withAuth';
import { resetForm } from '@/store/services/slices/formSlice';


type SpecilityDepartmentResponse = {
  speciality: any[];
  department: any[];
};


function BranchDetailPage() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading, refetch } = useGetBranchDoctorsQuery(id as string);
  const { data: SpecilityDepartment } = useGetSpecilityDepartmentQuery() as {
    data: SpecilityDepartmentResponse | undefined;
  };
  const [addDoctor] = useAddDoctorMutation();
  const [updateDoctor] = useUpdateDoctorMutation();
const [deleteDoctor] = useDeleteDoctorMutation();

 const speciality = SpecilityDepartment?.speciality
const department = SpecilityDepartment?.department;

console.log("selectedDoctor", selectedDoctor);


const addDoctorFeild = speciality && department ? generateDoctorFields(speciality, department) : [];

  if (isLoading) return <Loading />;

  const handleSubmit = async (data: { [key: string]: any }) => {
    try {
      const finalData = {
        ...data,
        hospitalbranchid: id,
      };
  
      if (selectedDoctor) {
        await updateDoctor({ ...finalData, doctorid: selectedDoctor.doctorid }).unwrap();
        toast.success("Doctor updated successfully!");
      } else {
        await addDoctor(finalData).unwrap();
        toast.success("Doctor added successfully!");
      }
  
      setIsModalOpen(false);
      setSelectedDoctor(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit form.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Doctor List</h1>
       {
              RoleNamesEnum.ADMIN === user?.role &&(
                <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-1 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
      >
        Add Doctor
      </button>)
            }

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
          <h2 className="text-lg font-semibold text-teal-800">{doctor.doctorName}</h2>
          <p className="text-gray-500">{doctor.specialtyname}</p>
          <p className="text-sm">{doctor.contactinformation}</p>
          <p className="text-sm italic text-gray-600">
            {doctor.departmentname}, {doctor.hospitalname} ({doctor.branchname})
          </p>
          <div className="flex justify-between mt-4">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setSelectedDoctor(doctor);
      setIsModalOpen(true);
    }}
    className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded"
  >
    Edit
  </button>
  <button
    onClick={(e) => {
      e.stopPropagation();
      setDeleteTargetId(doctor.doctorid);
      setDeleteModalOpen(true);
    }}
    className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
  >
    Delete
  </button>
</div>
        </motion.div>
      ))}
    </div>
    <Modal
  isOpen={deleteModalOpen}
  onClose={() => {
    dispatch(resetForm());
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  }}
>
  <div className="p-4 text-center">
    <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
    <p className="mb-6 text-gray-600">Are you sure you want to delete this doctor?</p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => setDeleteModalOpen(false)}
        className="bg-gray-300 px-4 py-2 rounded"
      >
        Cancel
      </button>
      <button
        onClick={async () => {
          try {
            await deleteDoctor(deleteTargetId as string)
            toast.success("Doctor deleted successfully!");
            setDeleteModalOpen(false);
            refetch();
          } catch (error) {
            toast.error("Failed to delete doctor.");
            console.error(error);
          }
        }}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  </div>
</Modal>


    <Modal
  isOpen={isModalOpen}
  onClose={() => {
    dispatch(resetForm());
    setIsModalOpen(false);
    setSelectedDoctor(null);
  }}
>
  <DynamicForm
    fields={addDoctorFeild}
    onSubmit={handleSubmit}
    initialValues={selectedDoctor ?? undefined}
    buttonText={selectedDoctor ? "Update Doctor" : "Add Doctor"}
    headText={selectedDoctor ? "Edit Doctor" : "Add Doctor"}
  />
</Modal>
    </div>
  );
}

export default withAuth(BranchDetailPage);
