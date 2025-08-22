import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidateField } from "../validators/registerValidator";
import type { RegisterField } from "../validators/registerValidator";
import InputField from "../../../shared/components/InputField";
import { fieldConfig } from "../constants/registerFieldConfig";
import logoUrl from "../../../assets/DriftusLogo.svg";

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

  return (
    <>
      {" "}
      <img
        src={logoUrl}
        alt="DriftUs — Feel the message."
        className="block mx-auto w-[min(90vw,720px)] mb-11"
      />
      <div className="flex justify-center w-full">
        {" "}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col mx-auto gap-2 justify-center"
        >
          {fieldConfig.map((field) => (
            <InputField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              errorMessages={showError[field.name]?.[0]}
              icon={field.icon}
              autoComplete={field.autoComplete}
            />
          ))}
          <div>
            <button
              type="submit"
              className=" bg-yellow-500 text-black px-4 py-2 mt-10 w-50"
            >
              Register Account
            </button>
          </div>
        </form>
      </div>
      <br />
      <div className="flex justify-center items-center">
        <h2 className="m-0 p-0">Already have an account?</h2>
        <button
          className="m-0 hover:underline "
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default Register;
