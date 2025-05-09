'use client';

import { useParams } from 'next/navigation';
import { useGetDoctorDetailsQuery } from '@/store/services/api/doctorApi';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {  useHospitalAddAppointmentMutation } from '@/store/services/api/appointmentApi';
import { getUpcomingAvailableSchedules } from '@/utils/dayWiseDate';
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux';
import Loading from '@/components/Loading';
import { withAuth } from '@/hoc/withAuth';

function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
   const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading } = useGetDoctorDetailsQuery(id as string);
  const [HospitalAddAppointment] = useHospitalAddAppointmentMutation();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [message, setMessage] = useState('');

  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if(!user){
      router.push('/login');
    }
  }, [user]);


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
  if (doctor) {
    upcomingSchedules = getUpcomingAvailableSchedules(doctor.scheduleList);
  }

  const handleClick = (id: any) => {
    router.push(`/home/appointments/${id}`);
  };

  if (!doctor) {
    return <div className="text-center">Doctor not found.</div>;
  }


  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-2">{doctor.doctorName}</h2>
      <p className="text-gray-600 mb-1">Specialty: {doctor.specialtyname}</p>
      <p className="text-gray-600 mb-1">Department: {doctor.departmentname}</p>
      <p className="text-gray-600 mb-1">Branch: {doctor.branchname}</p>
      <p className="text-gray-600 mb-4">Contact: {doctor.contactinformation}</p>
      <hr className="my-4" />

      <button onClick={() => handleClick(id)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">See Appointment List</button>
    {(user?.role === "Receptionist" || user?.role === "Admin") && (
      <>
        {/* Patient Name Input */}
        <h3 className="text-lg font-semibold mb-2">Patient Name</h3>
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Enter Patient Name"
          className="border rounded-lg px-3 py-2 mb-4 w-full"
        />

        {/* Patient Phone Number Input */}
        <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Phone Number"
          className="border rounded-lg px-3 py-2 mb-4 w-full"
        />

        {/* Schedule Selection */}
        <h3 className="text-lg font-semibold mb-2">Schedule <span className='text-red-500 text-xs font-mono'>Please select a Schedule</span></h3>
        {upcomingSchedules.length === 0 ? (
          <p>No available schedules in the next 7 days.</p>
        ) : (
          upcomingSchedules.map(({ date, schedule }) => (
            <motion.div
              key={`${schedule.scheduleid}-${date}`}
              className={`p-3 rounded-lg mb-2 cursor-pointer ${
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
    </motion.div>
  );
}


export default withAuth(DoctorProfilePage);
