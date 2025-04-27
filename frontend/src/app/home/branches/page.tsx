"use client";


import Loading from "@/components/Loading";
import { useGetBranchesQuery } from "@/store/services/api/hospitalApi";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BranchList() {
    const router = useRouter();
  const { data: branches, isLoading, error } = useGetBranchesQuery();

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500 text-center py-10">Failed to load branches</p>;


  const handleClick = (id: string) => {
    router.push(`/home/branches/${id}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Hospital Branches</h1>
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
