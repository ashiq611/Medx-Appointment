"use client";

import { withAuth } from "@/hoc/withAuth";
import { useGetAppointmentListByPatientIdQuery } from "@/store/services/api/hospitalApi";
import { motion } from "framer-motion";
import { Loader2, Phone, CalendarClock } from "lucide-react";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";

type Appointment = {
  appointmentid: string;
  appointmentdate: string; // ISO
  status: string;
  patientid: string;
  patientname: string;
  patientcontact: string;
  doctorid: string;
  doctorname: string;
  doctorcontact: string;
  hospitalbranchid: string;
  branchname: string;
};

const tz = "Asia/Dhaka";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

function statusClasses(status: string) {
  switch (status?.toLowerCase()) {
    case "scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "cancelled":
    case "canceled":
      return "bg-red-50 text-red-700 border-red-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function AppointmentList() {
  const { user } = useSelector((state: any) => state.auth);
  const personalId = user?.personalId;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAppointmentListByPatientIdQuery(personalId ?? skipToken);

  const appointments: Appointment[] = Array.isArray(data) ? data : [];

  // Sort by date ascending (nearest first)
  const sorted = [...appointments].sort(
    (a, b) =>
      new Date(a.appointmentdate).getTime() -
      new Date(b.appointmentdate).getTime()
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-700">My Appointments</h1>
        {(isLoading || isFetching) && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="animate-spin h-4 w-4" />
            Refreshing…
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Couldn’t load appointments{": "}
          {typeof error === "object" && error && "status" in (error as any)
            ? (error as any).status
            : "Please try again."}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && sorted.length === 0 && (
        <p className="text-center text-gray-500">No appointments found.</p>
      )}

      {/* List */}
      {!isLoading && !isError && sorted.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {sorted.map((a, idx) => (
            <motion.div
              key={a.appointmentid}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, delay: idx * 0.04 }}
              className="rounded-xl bg-white shadow p-4 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-lg text-gray-900">
                    {a.doctorname}
                  </p>
                  <p className="text-sm text-gray-500">
                    Patient: {a.patientname}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs border ${statusClasses(
                      a.status
                    )}`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarClock className="h-4 w-4" />
                  <span>{formatDate(a.appointmentdate)}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4" />
                  <span title={a.doctorcontact}>Doctor: {a.doctorcontact}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4" />
                  <span title={a.patientcontact}>
                    Patient: {a.patientcontact}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Branch:</span>
                  <span>{a.branchname}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default withAuth(AppointmentList);
