'use client'
import { setFieldValue } from '@/store/services/slices/formSlice';
import { RootState } from '@/store/store';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
}

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: { [key: string]: any }) => void;
  buttonText: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit, buttonText }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);

  const handleChange = (name: string, value: any) => {
    dispatch(setFieldValue({ key: name, value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-blue-600">Medical Appointment</h2>

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col space-y-2">
          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">{field.label}</label>
          <input
            id={field.name}
            className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type={field.type}
            placeholder={field.placeholder}
            value={formState[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        </div>
      ))}

      {/* Additional Date & Time Picker Fields for medical appointment */}
      {/* <div className="flex flex-col space-y-2">
        <label htmlFor="appointmentDate" className="text-sm font-medium text-gray-700">Appointment Date</label>
        <input
          id="appointmentDate"
          className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="date"
          value={formState.appointmentDate || ''}
          onChange={(e) => handleChange('appointmentDate', e.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="appointmentTime" className="text-sm font-medium text-gray-700">Appointment Time</label>
        <input
          id="appointmentTime"
          className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="time"
          value={formState.appointmentTime || ''}
          onChange={(e) => handleChange('appointmentTime', e.target.value)}
        />
      </div> */}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default DynamicForm;
