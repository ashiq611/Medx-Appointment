'use client';

import { useParams } from 'next/navigation';
import { useAddScheduleMutation, useDeleteScheduleMutation, useGetDoctorDetailsQuery } from '@/store/services/api/doctorApi';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {  useHospitalAddAppointmentMutation } from '@/store/services/api/appointmentApi';
import { allDays, getUpcomingAvailableSchedules } from '@/utils/dayWiseDate';
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux';
import Loading from '@/components/Loading';
import { withAuth } from '@/hoc/withAuth';
import Modal from '@/components/modal';
import DynamicForm from '@/components/DynamicForm';
import { RoleNamesEnum, scheduleFeilds } from '@/app/constant/formFeilds';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
   const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading } = useGetDoctorDetailsQuery(id as string);
  const [HospitalAddAppointment] = useHospitalAddAppointmentMutation();
  const [addSchedule] = useAddScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [message, setMessage] = useState('');

  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);


  


  if (isLoading) return <Loading />;

  const doctor = data?.data;

  const handleBooking = async () => {
    if (!selectedDate || !selectedSchedule || !patientName || !phoneNumber) {
      setMessage('Please fill patient name, phone number, date, and schedule.');
      return;
    }

    try {
      const res = await HospitalAddAppointment({
        patientname: patientName,
        phone_number: phoneNumber,
        doctorId: doctor.doctorid,
        date: selectedDate,
        ReceptionistID: user.personalId,
        HospitalBranchID: '5cbd7cbe-8681-43d5-b319-ee94c4335c49',
        scheduleid: selectedSchedule.scheduleid,
      });

      console.log(res);

      // clear the input fields
      setPatientName('');
      setPhoneNumber('');
      setSelectedSchedule(null);

      setMessage(`✅ Appointment booked! Serial No: ${res.data.appointmentserialnumber}`);
    } catch (err: any) {
      console.error(err);
      setMessage('❌ Failed to book appointment.');
    }
  };
  let upcomingSchedules: any[] = [];
  let scheduledDays: any[] = [];
  if (doctor) {
    upcomingSchedules = getUpcomingAvailableSchedules(doctor.scheduleList);
    scheduledDays = doctor?.scheduleList?.map((s: any) => s.day) || [];
  }
  
  const availableDays = allDays.filter(
    (day) => !scheduledDays.includes(day.value)
  );


  const filteredScheduleFields = [
    {
      name: 'day',
      label: 'Day',
      type: 'select',
      options: availableDays,
      required: true,
    },
    ...scheduleFeilds.slice(1), // remove original 'day' field and reuse rest
  ];

  const handleClick = (id: any) => {
    router.push(`/home/appointments/${id}`);
  };

  if (!doctor) {
    return <div className="text-center">Doctor not found.</div>;
  }

    const handleSubmit = async (data: { [key: string]: any }) => {
      try {
        const finalData = {
         ...data,
         doctorid: id
        }
        await addSchedule(finalData)
        .then((response) => {
          if (response.error) {
            const error = response.error as FetchBaseQueryError;
            toast.error((error.data as { message: string }).message);
            return;
          }
          setIsModalOpen(false);
          toast.success('Schedule added successfully!')
        })
      } catch (error) {
        console.error(error);
        alert('Failed to add schedule');
      }
    };

    const confirmDeleteSchedule = async () => {
      if (!scheduleToDelete) return;
      try {
        await deleteSchedule(scheduleToDelete).unwrap();
        toast.success("Schedule deleted successfully!");
        setSelectedSchedule(null);
        setSelectedDate('');
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete schedule.");
      } finally {
        setDeleteConfirmModal(false);
        setScheduleToDelete(null);
      }
    };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Doctor Details</h1>
       {
              RoleNamesEnum.ADMIN === user?.role &&(
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="px-4 py-1 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
              >
                Add Schedule
              </button>
              )
            }
     

      </div>
      <h2 className="text-2xl font-bold mb-2 text-teal-800">{doctor.doctorName}</h2>
      <p className="text-gray-600 mb-1">Specialty: {doctor.specialtyname}</p>
      <p className="text-gray-600 mb-1">Department: {doctor.departmentname}</p>
      <p className="text-gray-600 mb-1">Branch: {doctor.branchname}</p>
      <p className="text-gray-600 mb-4">Contact: {doctor.contactinformation}</p>
      <hr className="my-4" />

      <button onClick={() => handleClick(id)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">See Appointment List</button>
    {(user?.role === "Receptionist" || user?.role === "Admin") && (
      <>
        {/* Patient Name Input */}
        <h3 className="text-lg font-semibold mb-2 text-black">Patient Name</h3>
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Enter Patient Name"
          className="border rounded-lg px-3 py-2 mb-4 w-full text-black"
        />

        {/* Patient Phone Number Input */}
        <h3 className="text-lg font-semibold mb-2 text-black">Phone Number</h3>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Phone Number"
          className="border rounded-lg px-3 py-2 mb-4 w-full text-black"
        />

        {/* Schedule Selection */}
        <h3 className="text-lg font-semibold mb-2 text-teal-800">Schedule <span className='text-red-500 text-xs font-mono'>Please select a Schedule</span></h3>
        {upcomingSchedules.length === 0 ? (
          <p>No available schedules in the next 7 days.</p>
        ) : (
          upcomingSchedules.map(({ date, schedule }) => (
            <motion.div
              key={`${schedule.scheduleid}-${date}`}
              className={`p-3 rounded-lg mb-2 cursor-pointer text-black ${
                selectedSchedule?.scheduleid === schedule.scheduleid && selectedDate === date
                  ? 'bg-blue-100 border border-blue-400'
                  : 'bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedSchedule(schedule);
                setSelectedDate(date);
              }}
            >
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Day:</strong> {schedule.day}</p>
              <p><strong>Time:</strong> {schedule.startslot} - {schedule.endslot}</p>
              <button
  className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
  onClick={(e) => {
    e.stopPropagation(); // Prevent selecting schedule
    setScheduleToDelete(schedule.scheduleid);
    setDeleteConfirmModal(true);
  }}
>
  Delete
</button>
            </motion.div>
          ))
        )}

        {/* Book Appointment Button */}
        <button
          onClick={handleBooking}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Book Appointment
        </button>

        {/* Show message */}
        {message && <p className="mt-4 text-center text-green-700">{message}</p>}
      </>
    )}

<Modal isOpen={deleteConfirmModal} onClose={() => setDeleteConfirmModal(false)}>
  <div className="p-4">
    <h2 className="text-lg font-semibold text-center mb-4">Are you sure you want to delete this schedule?</h2>
    <div className="flex justify-center gap-4">
      <button
        onClick={confirmDeleteSchedule}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Yes, Delete
      </button>
      <button
        onClick={() => {
          setDeleteConfirmModal(false);
          setScheduleToDelete(null);
        }}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>


    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
           <DynamicForm fields={filteredScheduleFields} onSubmit={handleSubmit} buttonText="Add Branch" headText="Add Schedule"/>
          </Modal>
    </motion.div>
  );
}


export default withAuth(DoctorProfilePage);
