-- Enable UUID extension (only needed once per database)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Hospital Institute Table
CREATE TABLE Hospital_Institute (
    HospitalID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    HospitalName VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    ContactInformation VARCHAR(255)
);

-- Create Department Table
CREATE TABLE Department (
    DepartmentID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    DepartmentName VARCHAR(255) NOT NULL
);

-- Create Specialty Table
CREATE TABLE Specialty (
    SpecialtyID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    SpecialtyName VARCHAR(255) NOT NULL
);

-- Create Doctor Table
CREATE TABLE Doctor (
    DoctorID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255),
    SpecialtyID UUID REFERENCES Specialty(SpecialtyID),
    DepartmentID UUID REFERENCES Department(DepartmentID),
    HospitalID UUID REFERENCES Hospital_Institute(HospitalID)
);

-- Create Schedule Table
CREATE TABLE Schedule (
    ScheduleID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    DoctorID UUID REFERENCES Doctor(DoctorID),
    Day VARCHAR(50),
    StartSlot TIME,
    EndSlot TIME,
    Availability VARCHAR(50) CHECK (Availability IN ('Available', 'Unavailable')),
    CONSTRAINT valid_time_range CHECK (EndSlot > StartSlot)
);

-- Create Patient Table
CREATE TABLE Patient (
    PatientID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255),
    DateOfBirth DATE,
    MedicalHistory TEXT
);

-- Create Receptionist Table
CREATE TABLE Receptionist (
    ReceptionistID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255)
);

-- Create Admin Table
CREATE TABLE Admin (
    AdminID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255)
);

-- Create HospitalBranch Table
CREATE TABLE HospitalBranch (
    HospitalBranchID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    HospitalID UUID REFERENCES Hospital_Institute(HospitalID),
    BranchName VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    ContactInformation VARCHAR(255)
);


-- Create Appointment Table
CREATE TABLE Appointment (
    AppointmentID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    AppointmentDate TIMESTAMP NOT NULL,
    Status VARCHAR(50) CHECK (Status IN ('Scheduled', 'Completed', 'Canceled')),
    PatientID UUID REFERENCES Patient(PatientID),
    DoctorID UUID REFERENCES Doctor(DoctorID),
    ReceptionistID UUID REFERENCES Receptionist(ReceptionistID),
    HospitalBranchID UUID REFERENCES HospitalBranch(HospitalBranchID),
    ScheduleID UUID REFERENCES Schedule(ScheduleID),
    AppointmentSerialNumber INT,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User Table with Role
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Auto-generated UUID
    login_slug VARCHAR(255) NOT NULL UNIQUE,  -- Unique identifier for login
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Doctor', 'Patient', 'Receptionist', 'Admin')) NOT NULL,
    phone_number VARCHAR(255),  -- Renamed from ContactInformation

    -- Foreign Key References
    doctor_id UUID REFERENCES Doctor(DoctorID),
    patient_id UUID REFERENCES Patient(PatientID),
    admin_id UUID REFERENCES Admin(AdminID),  
    receptionist_id UUID REFERENCES Receptionist(ReceptionistID),

    -- New Columns
    is_blocked BOOLEAN DEFAULT false,  
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  
    updated_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  
);

ALTER TABLE "User"
ADD COLUMN is_mfa_active BOOLEAN DEFAULT false,
ADD COLUMN two_factor_secret VARCHAR(255);

ALTER TABLE "User"
ADD COLUMN is_first_logged_in BOOLEAN DEFAULT true;

ALTER TABLE "User" ADD COLUMN otp VARCHAR(6);
ALTER TABLE "User" ADD COLUMN otp_expiry BIGINT;


-- Alter Doctor Table to add HospitalBranchID
ALTER TABLE Doctor
ADD COLUMN HospitalBranchID UUID REFERENCES HospitalBranch(HospitalBranchID);







-- Optional: Create foreign key constraints between Admin and other tables (e.g., Admin managing Doctors, Patients)
CREATE OR REPLACE FUNCTION assign_serial_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate the serial number for the specific doctor and schedule
    NEW.AppointmentSerialNumber := (
        SELECT COALESCE(MAX(AppointmentSerialNumber), 0) + 1
        FROM Appointment
        WHERE DoctorID = NEW.DoctorID
          AND ScheduleID = NEW.ScheduleID
    );

    -- Return the new row with the serial number
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_appointment
BEFORE INSERT ON Appointment
FOR EACH ROW
EXECUTE FUNCTION assign_serial_number();

CREATE OR REPLACE FUNCTION assign_serial_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate serial number, resetting for each day
    NEW.AppointmentSerialNumber := (
        SELECT COALESCE(MAX(AppointmentSerialNumber), 0) + 1
        FROM Appointment
        WHERE DoctorID = NEW.DoctorID
          AND ScheduleID = NEW.ScheduleID
          AND DATE(AppointmentDate) = DATE(NEW.AppointmentDate) -- Ensures reset per day
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger and function if needed
DROP TRIGGER IF EXISTS before_insert_appointment ON Appointment;
DROP FUNCTION IF EXISTS assign_serial_number();

-- Alter Appointment Table to add CreatedOn and UpdatedOn
ALTER TABLE Appointment
ADD COLUMN CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create function to update UpdatedOn column on updates
CREATE OR REPLACE FUNCTION update_updatedon_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedOn := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set UpdatedOn before updates
CREATE TRIGGER set_updatedon
BEFORE UPDATE ON Appointment
FOR EACH ROW
EXECUTE FUNCTION update_updatedon_column();
