"use client";

import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { useGetDashboardQuery } from '@/store/services/api/hospitalApi';

// Register necessary chart elements with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement, 
  LineElement,  
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
  totalBranch: number;
  totalDepartment: number;
  totalDcotor: number;
  TotaldayWiseAppointment: any[];
  TotalBranchWiseDoctor: any[];
}

const Dashboard = () => {
  const { data: dashboardData } = useGetDashboardQuery() as unknown as { data: DashboardData };

  const { totalBranch, totalDepartment, totalDcotor, TotaldayWiseAppointment, TotalBranchWiseDoctor } = dashboardData || {};

  const appointmentAmountData = {
    labels: TotaldayWiseAppointment?.map(item => item.appointment_day.trim()) || [],
    datasets: [
      {
        label: 'Day-wise Appointment',
        data: TotaldayWiseAppointment?.map(item => Number(item.appointment_count)) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const branchDoctorAmountData = {
    labels: TotalBranchWiseDoctor?.map((item:any) => item.hospital_branch_name) || [],
    datasets: [
      {
        data: TotalBranchWiseDoctor?.map((item:any) => Number(item.total_doctors)) || [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Customize the colors
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">MedX Appointment Dashboard</h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Total Branches</h3>
          <p className="text-2xl font-bold text-gray-800">{totalBranch}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Total Departments</h3>
          <p className="text-2xl font-bold text-gray-800">{totalDepartment}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Total Doctors</h3>
          <p className="text-2xl font-bold text-gray-800">{totalDcotor}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Day-wise Appointment Amount Chart */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-medium text-gray-700 mb-4">Day-wise Appointment Amount</h3>
          <Line data={appointmentAmountData} />
        </div>

        {/* Branch-wise Doctor Amount Chart */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-medium text-gray-700 mb-4">Branch-wise Doctor Amount</h3>
          <Pie data={branchDoctorAmountData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
