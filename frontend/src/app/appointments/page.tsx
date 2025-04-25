// app/appointments/page.tsx
"use client";

import { useAddAppointmentMutation } from "@/store/services/api/appointmentApi";
import { useState } from "react";


export default function AppointmentPage() {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    ReceptionistID: "",
    HospitalBranchID: "",
  });

  const [addAppointment, { data, isLoading, error, isSuccess }] = useAddAppointmentMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAppointment(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block mb-1 capitalize">{key}</label>
            <input
              type="text"
              name={key}
              value={(formData as any)[key]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Book Appointment"}
        </button>
        {isSuccess && data?.data && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
            <p><strong>Appointment ID:</strong> {data.data.appointmentid}</p>
            <p><strong>Status:</strong> {data.data.status}</p>
          </div>
        )}
        {error && <p className="text-red-500">Something went wrong.</p>}
      </form>
    </div>
  );
}