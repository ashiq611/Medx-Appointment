# Medx-Appointment System Documentation

## Overview

**Medx-Appointment** is a comprehensive healthcare management system designed to facilitate appointment scheduling, doctor management, patient tracking, and hospital operations. The system includes features for users to book appointments, doctors to manage their schedules, receptionists to oversee the appointment list and print out reports, and admins to have full access to all management features.

## Features

### 1. **Hospital Management**
- Manage doctor schedules.
- Update and manage doctor details (specializations, availability, etc.).
- View and manage appointments.
- **Admin Role**: Full access to manage hospital operations, including doctor management, patient management, and receptionists.

### 2. **Doctor Management**
- Doctors can list their available timeslots.
- Doctors can view a list of patients with their diseases and treatment details.
- Update patient records (disease diagnosis, treatment plans, etc.).
- **Admin Role**: Can manage doctor details, add/remove doctors, and update schedules across the hospital.

### 3. **Appointment Scheduling**
- Patients can book appointments with doctors based on availability, specialization, and doctor preference.
- Real-time booking updates to ensure accurate scheduling.
- Ability to reschedule or cancel appointments.
- **Admin Role**: Can view all appointments and manage scheduling for any doctor or patient.

### 4. **Reception Management**
- Receptionists can view and manage the full list of appointments.
- Can generate and print appointment reports.
- Coordinate with patients and doctors to confirm schedules.
- **Admin Role**: Full access to manage receptionists and their permissions. Can also oversee all appointment records.

### 5. **Patient Management**
- Doctors and receptionists can access and manage patient information (medical history, appointment history, diseases).
- Doctors can update patient disease details and follow-up instructions.
- **Admin Role**: Can manage patient records across all doctors, oversee diagnoses, and ensure proper management of all patient data.

## User Roles

### 1. **Admin**
- Full access to all aspects of the system.
- Can manage hospital operations, doctor schedules, appointments, and patient records.
- Can add, remove, or update doctor details, manage patient data, and oversee the reception team.
- Can generate reports for the entire system, including doctor performance, patient data, and appointment histories.
- **Has full control over the system, including access control and user management.**

### 2. **Patients (Users)**
- Search for doctors based on specialization, availability, and location.
- Book and reschedule appointments.
- View appointment history and treatment progress.

### 3. **Receptionists**
- View the list of all appointments.
- Manage patient interactions and appointment confirmations.
- Print appointment reports for patients.
- **Admin Role**: Can manage receptionists and assign them roles and responsibilities.

### 4. **Doctors**
- View and manage appointments for the day.
- View patient information and medical history.
- Update patient records with diagnosis, disease, and treatment details.
- **Admin Role**: Can manage doctor availability and schedules.

### **Admin Role Features:**
The **Admin** role has extensive privileges to manage and control all aspects of the system. This includes:

1. Full access to view and manage doctors, receptionists, patients, appointments, and reports.
2. Ability to assign and manage user roles and permissions.
3. Can configure and manage the system settings and hospital-wide configurations.

With the Admin role included, the system is now much more flexible and scalable, as the Admin can monitor and modify all operations from a single point.


## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (React/Angular for dynamic components), Typescripts
- **Backend**:  Nodejs (Express), Typescripts
- **Database**: PostgreSQL
- **Authentication**: OAuth for secure login (users, doctors, receptionists, admin)
<!-- - **Payment Integration**: Stripe, PayPal (optional for online appointment booking) -->
