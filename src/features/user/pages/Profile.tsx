import { useAuth } from "../../../shared/hooks/useAuth";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import SideNav from "../../../shared/components/sideNav";
import { BarChart3, UserCircle } from "lucide-react";
import { SidebarItem } from "../../../shared/components/sideNav";

import {
  RegisterFieldRules,
  ValidateField,
} from "../../auth/validators/registerValidator";
import type { RegisterField } from "../../auth/validators/registerValidator";
import InputField from "../../../shared/components/InputField";
import { fieldConfig } from "../../auth/constants/registerFieldConfig";

type Form = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
};
const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [showError, setShowError] = useState<
    Partial<Record<RegisterField, string[]>>
  >({});

  const [form, setForm] = useState<Form>({
    id: user?.id ?? "",
    username: user?.user ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar ?? "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fields = Object.keys(RegisterFieldRules) as RegisterField[];

    const allErrors = fields.reduce((acc, field) => {
      const value = form[field] ?? "";
      const errors = ValidateField(field, value);
      if (errors.length) acc[field] = errors;
      return acc;
    }, {} as Partial<Record<RegisterField, string[]>>);

    setShowError(allErrors);

    if (Object.keys(allErrors).length > 0) return;

    const token = localStorage.getItem("token");
    if (!token) console.log("error, missing token");

    const res = await fetch(`https://chatify-api.up.railway.app/user`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: form.id,
        updatedData: {
          user: form.username,
          email: form.email,
          avatar: form.avatar,
          password: form.password,
        },
      }),
    });

    if (res.ok) {
      refreshUser();
      console.log("Update was successful");
    } else {
      console.log("Update failed.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("You sure you want to delete this account?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    if (!token) console.log("error, missing token");

    const res = await fetch(
      `https://chatify-api.up.railway.app/users/${user?.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      logout();
      navigate("/login");
    } else {
      console.log("failed to delete account");
    }
  };

  return (
    <div className="flex h-screen fixed left-0 top-0 ml-[width]">
      {" "}
      <SideNav>
        <SidebarItem
          icon={<BarChart3 size={20} />}
          text="Profile"
          to="/profile"
          end
        />{" "}
        <SidebarItem
          icon={<UserCircle size={20} />}
          text="Log Out"
          onClick={logout}
        />
      </SideNav>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          {fieldConfig.map((field) => (
            <InputField
              key={field.name}
              label={field.name}
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

          <button type="submit">Save Changes</button>
        </form>
        <button onClick={handleDelete}>Delete Account</button>{" "}
      </div>
    </div>
  );
};

export default Profile;
