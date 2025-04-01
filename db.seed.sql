-- Create Hospital/Institute Table
CREATE TABLE Hospital_Institute (
    HospitalID SERIAL PRIMARY KEY,
    HospitalName VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    ContactInformation VARCHAR(255)
);

-- Create Department Table
CREATE TABLE Department (
    DepartmentID SERIAL PRIMARY KEY,
    DepartmentName VARCHAR(255) NOT NULL
);

-- Create Specialty Table
CREATE TABLE Specialty (
    SpecialtyID SERIAL PRIMARY KEY,
    SpecialtyName VARCHAR(255) NOT NULL
);

-- Create Doctor Table
CREATE TABLE Doctor (
    DoctorID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255),
    SpecialtyID INT REFERENCES Specialty(SpecialtyID),
    DepartmentID INT REFERENCES Department(DepartmentID),
    HospitalID INT REFERENCES Hospital_Institute(HospitalID)
);

-- Create Schedule Table
CREATE TABLE Schedule (
    ScheduleID SERIAL PRIMARY KEY,
    DoctorID INT REFERENCES Doctor(DoctorID),
    Day VARCHAR(50),
    StartSlot TIME,
    EndSlot TIME,
    Availability VARCHAR(50) CHECK (Availability IN ('Available', 'Unavailable')),
    CONSTRAINT valid_time_range CHECK (EndSlot > StartSlot)
);

-- Create Patient Table
CREATE TABLE Patient (
    PatientID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255),
    DateOfBirth DATE,
    MedicalHistory TEXT
);

-- Create Receptionist Table
CREATE TABLE Receptionist (
    ReceptionistID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255)
);

-- Create Admin Table
CREATE TABLE Admin (
    AdminID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    ContactInformation VARCHAR(255)
);

-- Create Appointment Table
CREATE TABLE Appointment (
    AppointmentID SERIAL PRIMARY KEY,
    AppointmentDate TIMESTAMP NOT NULL,
    Status VARCHAR(50) CHECK (Status IN ('Scheduled', 'Completed', 'Canceled')),
    PatientID INT REFERENCES Patient(PatientID),
    DoctorID INT REFERENCES Doctor(DoctorID),
    ReceptionistID INT REFERENCES Receptionist(ReceptionistID)
);

-- Create User Table with Role
CREATE TABLE "User" (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) CHECK (Role IN ('Doctor', 'Patient', 'Receptionist', 'Admin')) NOT NULL,
    ContactInformation VARCHAR(255),
    DoctorID INT REFERENCES Doctor(DoctorID),
    PatientID INT REFERENCES Patient(PatientID)
);
ALTER TABLE "User"
ADD COLUMN AdminID INT REFERENCES Admin(AdminID);

ALTER TABLE "User"
ADD COLUMN ReceptionistID INT REFERENCES Receptionist(ReceptionistID);

CREATE TABLE HospitalBranch (
    HospitalBranchID SERIAL PRIMARY KEY,
    HospitalID INT REFERENCES Hospital_Institute(HospitalID),
    BranchName VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    ContactInformation VARCHAR(255)
);

-- Alter Doctor Table to add HospitalBranchID
ALTER TABLE Doctor
ADD COLUMN HospitalBranchID INT REFERENCES HospitalBranch(HospitalBranchID);

-- Alter Appointment Table to add HospitalBranchID
ALTER TABLE Appointment
ADD COLUMN HospitalBranchID INT REFERENCES HospitalBranch(HospitalBranchID);

ALTER TABLE Appointment
ADD COLUMN ScheduleID INT REFERENCES Schedule(ScheduleID);

-- Alter the Appointment Table to Add AppointmentSerialNumber
ALTER TABLE Appointment
ADD COLUMN AppointmentSerialNumber INT;



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

DROP TRIGGER IF EXISTS before_insert_appointment ON Appointment;


DROP FUNCTION IF EXISTS assign_serial_number();

ALTER TABLE Appointment
ADD COLUMN CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE OR REPLACE FUNCTION update_updatedon_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedOn := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updatedon
BEFORE UPDATE ON Appointment
FOR EACH ROW
EXECUTE FUNCTION update_updatedon_column();


-- Insert data into Hospital_Institute
INSERT INTO Hospital_Institute (HospitalName, Location, ContactInformation)
VALUES 
('City Hospital', 'Dhaka, Bangladesh', '01012345678'),
('Medicare Institute', 'Chittagong, Bangladesh', '01087654321');

-- Insert data into Department
INSERT INTO Department (DepartmentName)
VALUES 
('Cardiology'),
('Neurology'),
('Pediatrics');

-- Insert data into Specialty
INSERT INTO Specialty (SpecialtyName)
VALUES 
('Cardiologist'),
('Neurologist'),
('Pediatrician');

-- Insert data into Doctor
INSERT INTO Doctor (Name, ContactInformation, SpecialtyID, DepartmentID, HospitalID)
VALUES 
('Dr. John Smith', '01123456789', 1, 1, 1),
('Dr. Jane Doe', '01234567890', 2, 2, 1),
('Dr. Alice Brown', '01345678901', 3, 3, 2);

-- Insert data into Schedule
INSERT INTO Schedule (DoctorID, Day, StartSlot, EndSlot, Availability)
VALUES 
(1, 'Monday', '09:00', '12:00', 'Available'),
(1, 'Tuesday', '13:00', '16:00', 'Available'),
(1, 'Wednesday', '10:00', '13:00', 'Available');

-- Insert data into Patient
INSERT INTO Patient (Name, ContactInformation, DateOfBirth, MedicalHistory)
VALUES 
('Ali Ahmed', '01712345678', '2000-05-10', 'Asthma'),
('Rita Rahman', '01723456789', '1995-09-22', 'Diabetes'),
('Tariq Islam', '01734567890', '1987-12-15', 'No major health issues');

-- Insert data into Receptionist
INSERT INTO Receptionist (Name, ContactInformation)
VALUES 
('Sara Khan', '01812345678'),
('Rima Sultana', '01823456789');

-- Insert data into Admin
INSERT INTO Admin (Name, ContactInformation)
VALUES 
('Mr. Omar', '01912345678'),
('Ms. Rima', '01923456789');

-- Insert data into Appointment
INSERT INTO Appointment (AppointmentDate, Status, PatientID, DoctorID, ReceptionistID)
VALUES 
('2025-02-25 10:00:00', 'Scheduled', 1, 1, 1),
('2025-02-26 14:00:00', 'Scheduled', 2, 2, 2),
('2025-02-27 11:00:00', 'Scheduled', 3, 3, 1);

-- Insert data into User
INSERT INTO "User" (Username, Password, Role, ContactInformation, DoctorID, PatientID)
VALUES 
('johnsmith', 'password123', 'Doctor', '01123456789', 1, NULL),
('janedoe', 'password456', 'Doctor', '01234567890', 2, NULL),
('alicebrown', 'password789', 'Doctor', '01345678901', 3, NULL),
('ali_ahmed', 'password101', 'Patient', '01712345678', NULL, 1),
('rita_rahman', 'password102', 'Patient', '01723456789', NULL, 2),
('tariq_islam', 'password103', 'Patient', '01734567890', NULL, 3),
('sarakh', 'password104', 'Receptionist', '01812345678', NULL, NULL),
('rimasultana', 'password105', 'Receptionist', '01823456789', NULL, NULL),
('admin_omar', 'adminpass', 'Admin', '01912345678', NULL, NULL),
('admin_rima', 'adminpass2', 'Admin', '01923456789', NULL, NULL);

INSERT INTO HospitalBranch (HospitalID, BranchName, Location, ContactInformation)
VALUES 
(1, 'City Hospital - Main Branch', 'Dhaka, Bangladesh', '01012345678'),
(1, 'City Hospital - Downtown Branch', 'Dhaka, Bangladesh', '01012345679'),
(2, 'Medicare Institute - Main Branch', 'Chittagong, Bangladesh', '01087654321');
