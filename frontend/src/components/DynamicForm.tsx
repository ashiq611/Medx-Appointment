'use client';

import { setFieldValue } from '@/store/services/slices/formSlice';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[]; 
}

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: { [key: string]: any }) => void;
  buttonText: string;
  headText?: string;
  initialValues?: { [key: string]: any };
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit, buttonText, headText = "Login Page", initialValues}) => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: any) => {
    dispatch(setFieldValue({ key: name, value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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

  const renderField = (field: Field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formState[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleChange(field.name, e.target.value),
      placeholder: field.placeholder,
      className: `border-2 rounded-lg p-3 focus:outline-none focus:ring-2 w-full ${
        errors[field.name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      }`,
    };

    switch (field.type) {
      case 'text':
        return <textarea rows={4} {...commonProps} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="flex gap-4">
            {field.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={formState[field.name] === opt.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  useEffect(() => {
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, value]) => {
        dispatch(setFieldValue({ key, value }));
      });
    }
  }, [initialValues, dispatch]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-center text-blue-600">{headText}</h2>

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col space-y-2 ">
          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {renderField(field)}
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