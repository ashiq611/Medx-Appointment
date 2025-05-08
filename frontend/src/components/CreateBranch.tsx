import { useState } from "react";

type BranchFormProps = {
  onSubmit: (data: {BranchName : string, Location : string, contactinformation : string }) => void;
};

const CreateBranchForm = ({ onSubmit }: BranchFormProps) => {
  const [formData, setFormData] = useState({
    BranchName: "",
    Location: "",
    contactinformation: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ BranchName: "", Location: "", contactinformation: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold mb-2">Create Branch</h2>

      <div>
        <label className="block text-sm font-medium">Branch Name</label>
        <input
          type="text"
          name="BranchName"
          value={formData.BranchName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          name="Location"
          value={formData.Location}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Mobile Number</label>
        <input
          type="tel"
          name="contactinformation"
          value={formData.contactinformation}
          onChange={handleChange}
          pattern="01[3-9][0-9]{8}"
          required
          className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Create Branch
      </button>
    </form>
  );
};

export default CreateBranchForm;
