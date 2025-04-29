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
  