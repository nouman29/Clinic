import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import PatientDetail from "@/pages/PatientDetail";
import Prescriptions from "@/pages/Prescriptions";
import DoctorProfile from "@/pages/DoctorProfile"; // Kept for backward compatibility or if needed
import Settings from "@/pages/Settings";
import Doctors from "@/pages/Doctors";
import Nurses from "@/pages/Nurses";
import Appointments from "@/pages/Appointments";
import Medicines from "@/pages/Medicines";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import SystemSettings from "@/pages/SystemSettings";
import LabReports from "@/pages/LabReports";
import AssignedPatients from "@/pages/AssignedPatients";
import PatientVitals from "@/pages/PatientVitals";
import BookAppointment from "@/pages/BookAppointment";

import { AppLayout } from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import PublicRoute from "@/components/PublicRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Routes - Only accessible when NOT logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected Routes - Only accessible when logged in */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Shared Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />

          {/* Admin-Only Pages */}
          <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/nurses" element={<Nurses />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/patients" element={<Patients />} />
          </Route>

          {/* Doctor-Only Pages */}
          <Route element={<RoleProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/my-patients" element={<Patients />} />
            <Route path="/lab-reports" element={<LabReports />} />
          </Route>

          {/* Nurse-Only Pages */}
          <Route element={<RoleProtectedRoute allowedRoles={["nurse"]} />}>
            <Route path="/assigned-patients" element={<AssignedPatients />} />
            <Route path="/patient-vitals" element={<PatientVitals />} />
          </Route>

          {/* Patient-Only Pages */}
          <Route element={<RoleProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/book-appointment" element={<BookAppointment />} />
          </Route>

          {/* Staff Shared (Admin, Doctor, Nurse) */}
          <Route element={<RoleProtectedRoute allowedRoles={["admin", "doctor", "nurse"]} />}>
            <Route path="/appointments" element={<Appointments />} />
          </Route>

          {/* Appointments for Patients */}
          <Route element={<RoleProtectedRoute allowedRoles={["patient"]} />}>
            <Route path="/my-appointments" element={<Appointments />} />
          </Route>

          {/* Prescriptions for Admin, Doctor, Patient */}
          <Route element={<RoleProtectedRoute allowedRoles={["admin", "doctor", "patient"]} />}>
            <Route path="/prescriptions" element={<Prescriptions />} />
          </Route>

          {/* Billing for Admin, Patient */}
          <Route element={<RoleProtectedRoute allowedRoles={["admin", "patient"]} />}>
            <Route path="/billing" element={<Billing />} />
          </Route>

          {/* Patient Detail (Shared if needed, usually Admin/Doctor/Nurse) */}
          <Route element={<RoleProtectedRoute allowedRoles={["admin", "doctor", "nurse"]} />}>
            <Route path="/patients/:id" element={<PatientDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

