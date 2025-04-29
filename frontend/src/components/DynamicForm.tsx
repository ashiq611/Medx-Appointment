'use client';
import { setFieldValue } from '@/store/services/slices/formSlice';
import { RootState } from '@/store/store';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: { [key: string]: any }) => void;
  buttonText: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit, buttonText }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: any) => {
    dispatch(setFieldValue({ key: name, value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // clear error when typing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    fields.forEach((field) => {
      if (field.required && !formState[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-blue-600">Medical Appointment</h2>

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col space-y-2">
          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            id={field.name}
            className={`border-2 rounded-lg p-3 focus:outline-none focus:ring-2 ${
              errors[field.name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            type={field.type}
            placeholder={field.placeholder}
            value={formState[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
          {field.name === 'phoneNumber' && (
            <p className="text-sm text-gray-500">Format: 018XXXXXXXX ; Don't use +88</p>
          )}
          {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
        </div>
      ))}

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
