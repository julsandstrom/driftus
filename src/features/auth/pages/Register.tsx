import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidateField } from "../validators/registerValidator";
import type { RegisterField } from "../validators/registerValidator";
type User = {
  username: string;
  email: string;
  password: string;
  avatar: string;
};

const Register = () => {
  const [form, setForm] = useState<User>({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [showError, setShowError] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors = Object.entries(form).reduce((acc, [field, value]) => {
      const errors = ValidateField(field as RegisterField, value);
      if (errors.length > 0) {
        acc[field] = errors;
      }
      return acc;
    }, {} as Record<string, string[]>);

    if (Object.keys(allErrors).length > 0) {
      console.log("Validation errors", allErrors);
      setShowError(allErrors);
      return;
    }

    try {
      const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
        credentials: "include",
      });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken;

      const res = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form, csrfToken }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      if (res.ok) {
        navigate("/login");
      }
    } catch {
      console.log("Something went wrong");
    }
  };
  ///CONTAINER PRESENTER FIX
  return (
    <>
      <h1 className="text-3xl text-bold mb-10">Register User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label>User </label>
        {showError.username?.map((c, idx) => (
          <p key={idx}>{c}</p>
        ))}
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-300 p-2 border"
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-300 p-2 border"
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-300 p-2 border"
        />

        <label>Avatar</label>
        <input
          name="avatar"
          placeholder="Avatar URL(optional)"
          onChange={handleChange}
          className="w-300 p-2 border"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-10 w-80 mb-20"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Register;
