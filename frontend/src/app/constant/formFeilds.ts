



export const loginFormFields = [
    {
      label: "Phone Number",
      name: "phoneNumber",
      type: "string",
      required: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      required: true,
    },
  ];

export const registerFormFields = [
  {
      label: "Name",
      name: "name",
      type: "string",
      required: true,
  },
    {
      label: "Phone Number",
      name: "phoneNumber",
      type: "string",
      required: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      required: true,
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: "password",
      required: true,
    },
  ];

export const verifyOtpFormFields = [
    {
      label: "OTP",
      name: "otp",
      type: "string",
      required: true,
    }
    ];

// for add doctor




export const generateDoctorFields = (
  speciality: { specialtyid: string; specialtyname: string }[],
  department: { departmentid: string; departmentname: string }[]
) => [
  {
    label: "Doctor Name",
    name: "doctorName",
    type: "string",
    required: true,
  },
  {
    label: "Phone Number",
    name: "contactinformation",
    type: "string",
    required: true,
  },
  {
    label: "Specialty",
    name: "specialtyid",
    type: "select",
    required: true,
    options: speciality.map((s) => ({
      label: s.specialtyname,
      value: s.specialtyid,
    })),
  },
  {
    label: "Department",
    name: "departmentid",
    type: "select",
    required: true,
    options: department.map((d) => ({
      label: d.departmentname,
      value: d.departmentid,
    })),
  },
  {
    label: "Education History",
    name: "educationhistory",
    type: "text",
    required: true,
  },
  {
    label: "Room No",
    name: "roomno",
    type: "string",
    required: true,
  },
];


export const branchFields = [
  {
    label: "Branch Name",
    name: "branchname",
    type: "string",
    required: true,
  },
  {
    label: "Location",
    name: "location",
    type: "string",
    required: true,
  },
  {
    label: "Contact Information",
    name: "contactinformation",
    type: "string",
    required: true,
  },
];


export const scheduleFeilds =  [
  {
    name: 'day',
    label: 'Day',
    type: 'select',
    options: [
      { label: 'Saturday', value: 'Saturday' },
      { label: 'Sunday', value: 'Sunday' },
      { label: 'Monday', value: 'Monday' },
      { label: 'Tuesday', value: 'Tuesday' },
      { label: 'Wednesday', value: 'Wednesday' },
      { label: 'Thursday', value: 'Thursday' },
      { label: 'Friday', value: 'Friday' },
    ],
    required: true,
  },
  {
    name: 'availability',
    label: 'Availability',
    type: 'select',
    options: [
      { label: 'Available', value: 'Available' },
      { label: 'Unavailable', value: 'Unavailable' },
    ],
    required: true,
  },
  {
    name: 'start_time',
    label: 'Start Time',
    type: 'time',
    required: true,
  },
  {
    name: 'end_time',
    label: 'End Time',
    type: 'time',
    required: true,
  },
];


export const userFields = [
  {
    label: "Name",
    name: "name",
    type: "string",
    required: true,
  },
  {
    label: "Phone Number",
    name: "phone_number",
    type: "string",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    required: true,
  },
  {
    label: "Role",
    name: "role",
    type: "select",
    required: true,
    options: [
      { label: "Admin", value: "Admin" },
      { label: "Receptionist", value: "Receptionist" },
    ],
  },
];


export const RoleNamesEnum = {
  ADMIN: "Admin",
  DOCTOR: "Doctor",
  PATIENT: "Patient",
  RECEPTION: "Receptionist",
};
