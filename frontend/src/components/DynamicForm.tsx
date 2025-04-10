'use client';

import { useFormStore } from "@/store/useStore";



interface Field {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}

export default function DynamicForm({
  fields,
  onSubmit,
  buttonText = "Submit",
}: {
  fields: Field[];
  onSubmit: () => void;
  buttonText?: string;
}) {
  // Use Zustand store to access and update form data
  const { formData, setFormValue } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue(name, value); // Update form data in Zustand store
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="max-w-sm mx-auto mt-10 space-y-6"
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block mb-1">{field.label}</label>
          <input
            className="w-full border p-2 rounded"
            type={field.type}
            name={field.name}
            required={field.required}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
      >
        {buttonText}
      </button>
    </form>
  );
}
