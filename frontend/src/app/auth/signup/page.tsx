"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { queryAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
    role_type: "individual",
    first_name: "",
    last_name: "",
    company_name: "",
    business_tax_number: "",
    phone: "",
    mobile: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, role: e.target.value, role_type: "individual" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await queryAPI("auth/signup", {
        method: "POST",
        body: form,
        needAuth: false,
        parseResponse: false,
      });
      toast.success("Signup successful!");
      if (form.role === "user") {
        router.push("/skills");
      } else {
        router.push("/tasks");
      }
    } catch {
      toast.error("Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <div className="text-sm text-gray-500 mb-2">
        Fields marked with <span className="text-red-500">*</span> are required.
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Role
          <select
            name="role"
            value={form.role}
            onChange={handleRoleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
        </label>
        <label className="block">
          Role Type
          <select
            name="role_type"
            value={form.role_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </label>
        <label className="block">
          Email <span className="text-red-500">*</span>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <label className="block">
          Password <span className="text-red-500">*</span>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        {form.role_type === "individual" && (
          <>
            <label className="block">
              First Name <span className="text-red-500">*</span>
              <input
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
            <label className="block">
              Last Name <span className="text-red-500">*</span>
              <input
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
            <label className="block">
              Mobile <span className="text-red-500">*</span>
              <input
                name="mobile"
                placeholder="Mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
            <label className="block">
              Address <span className="text-red-500">*</span>
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
          </>
        )}
        {form.role_type === "company" && (
          <>
            <label className="block">
              Company Name <span className="text-red-500">*</span>
              <input
                name="company_name"
                placeholder="Company Name"
                value={form.company_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
            <label className="block">
              Business Tax Number <span className="text-red-500">*</span>
              <input
                name="business_tax_number"
                placeholder="Business Tax Number"
                value={form.business_tax_number}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
                pattern="^[A-Z0-9]{10}$"
              />
            </label>
            <label className="block">
              Representative First Name <span className="text-red-500">*</span>
              <input
                name="first_name"
                placeholder="Representative First Name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
            <label className="block">
              Representative Last Name <span className="text-red-500">*</span>
              <input
                name="last_name"
                placeholder="Representative Last Name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
            <label className="block">
              Mobile <span className="text-red-500">*</span>
              <input
                name="mobile"
                placeholder="Mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
            <label className="block">
              Phone <span className="text-red-500">*</span>
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>
            <label className="block">
              Address
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </label>
          </>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
