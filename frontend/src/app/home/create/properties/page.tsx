"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetSpecilityDepartmentQuery } from "@/store/services/api/hospitalApi";

type SpecilityDepartmentResponse = {
  speciality: any[];
  department: any[];
};

const DepartmentSpecialtyPage = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);

  const [specialtyName, setSpecialtyName] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  const { data: SpecilityDepartment } = useGetSpecilityDepartmentQuery() as {
    data: SpecilityDepartmentResponse | undefined;
  };

  console.log(SpecilityDepartment);

  useEffect(() => {
    if (SpecilityDepartment) {
      setDepartments(SpecilityDepartment?.department);
      setSpecialties(SpecilityDepartment?.speciality);
    }
  }, [SpecilityDepartment]);

  const handleAddDepartment = () => {
    if (departmentName.trim()) {
      setDepartments((prev) => [...prev, departmentName.trim()]);
      setDepartmentName("");
    }
  };

  const handleAddSpecialty = () => {
    if (specialtyName.trim()) {
      setSpecialties((prev) => [...prev, specialtyName.trim()]);
      setSpecialtyName("");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-b from-gray-100 to-blue-200"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-center mb-8 text-blue-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Department & Specialty Management
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Department Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            ➤ Add Department
          </h2>
          <div className="flex items-center space-x-2 mb-4">
            <motion.input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name"
              className="flex-grow px-4 py-2 border rounded-md"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              onClick={handleAddDepartment}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              whileTap={{ scale: 0.95 }}
            >
              Add
            </motion.button>
          </div>

          <h3 className="text-md font-semibold mb-2">Department List:</h3>
          <ul className="space-y-2">
            <AnimatePresence>
              {departments.map((dept, index) => (
                <motion.li
                  key={dept.departmentid || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-800 px-4 py-2 rounded-md shadow-sm"
                >
                  <span className="font-medium">{dept.departmentname}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>

        {/* Specialty Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            ➤ Add Specialty
          </h2>
          <div className="flex items-center space-x-2 mb-4">
            <motion.input
              type="text"
              value={specialtyName}
              onChange={(e) => setSpecialtyName(e.target.value)}
              placeholder="Enter specialty name"
              className="flex-grow px-4 py-2 border rounded-md"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              onClick={handleAddSpecialty}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              whileTap={{ scale: 0.95 }}
            >
              Add
            </motion.button>
          </div>

          <h3 className="text-md font-semibold mb-2">Specialty List:</h3>
          <ul className="space-y-2">
            <AnimatePresence>
              {specialties.map((spec, index) => (
                <motion.li
                  key={spec.specialtyid || index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-green-50 hover:bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-sm"
                >
                  <span className="font-medium">{spec.specialtyname}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DepartmentSpecialtyPage;
