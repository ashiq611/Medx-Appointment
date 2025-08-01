"use client";

import { setFieldValue } from "@/store/services/slices/formSlice";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

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

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  buttonText,
  headText = "Login Page",
  initialValues,
}) => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: any) => {
    dispatch(setFieldValue({ key: name, value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
    const value = formState[field.name] || "";

    switch (field.type) {
      case "text":
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );

      case "select":
        return (
          <Select
            onValueChange={(val) => handleChange(field.name, val)}
            value={value}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleChange(field.name, val)}
            className="flex gap-6"
          >
            {field.options?.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
                <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return (
          <Input
            type={field.type}
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
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
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>

          {renderField(field)}

          {field.name === "phoneNumber" && (
            <p className="text-sm text-muted-foreground">
              Format: 018XXXXXXXX ; Don't use +88
            </p>
          )}

          {errors[field.name] && (
            <p className="text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <Button type="submit" className="w-full">
        {buttonText}
      </Button>
    </form>
  );
};

export default DynamicForm;
