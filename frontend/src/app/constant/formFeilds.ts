// constants/formFields.ts

import { label } from "framer-motion/client";

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


export const doctorFields = [
  {
    label: "Doctor Name",
    name: "name",
    type: "string",
    required: true,
  },
  {
    label: "Contact Information",
    name: "contactinformation",
    type: "string",
    required: false,
  },
  {
    label: "Education History",
    name: "educationhistory",
    type: "text", // This can be rendered as a textarea in your DynamicForm
    required: false,
  },
  {
    label: "Room No",
    name: "roomno",
    type: "string",
    required: false,
  },
];

export const branchFields = [
  {
    label: "Branch Name",
    name: "name",
    type: "string",
    required: true,
  },
  {
    label: "Address",
    name: "address",
    type: "string",
    required: false,
  },
];