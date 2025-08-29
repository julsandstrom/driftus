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
import logoUrl from "../../../assets/DriftusLogo.svg";
import { Button } from "../../../shared/components/Button";
import { useAvatarPreview } from "../../../shared/context/AvatarPreviewContext";
import * as Sentry from "@sentry/react";
type Form = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
};
const Profile = () => {
  const { user, logout, refreshUser, clearConversationsCache } = useAuth();
  const navigate = useNavigate();
  const [showError, setShowError] = useState<
    Partial<Record<RegisterField, string[]>>
  >({});
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const { setPreview } = useAvatarPreview();

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

    if (name === "avatar") {
      const clean = value.trim();

      if (!clean || clean === (user?.avatar ?? "")) setPreview(null);
      else setPreview(clean);
    }
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
      setShowSuccessMsg(true);
      setPreview(null);
      console.log("Update was successful");
      Sentry.captureMessage("profile:update_success", { level: "info" });
    } else {
      setShowSuccessMsg(false);
      console.warn("Update failed.");
      Sentry.captureMessage("profile:update_failed", {
        level: "error",
        extra: { status: res.status, userId: form.id },
      });
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
      clearConversationsCache();
      navigate("/login");
    } else {
      console.log("failed to delete account");
    }
  };

  return (
    <>
      <div className="flex h-screen fixed left-0 top-0 ml-[width]">
        {" "}
        <SideNav>
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="Home"
            to="/chat"
            end
          />
          <SidebarItem
            icon={<BarChart3 size={20} />}
            text="Profile"
            to="/profile"
            end
          />
          <div className="mt-11">
            <SidebarItem
              icon={<UserCircle size={20} />}
              text="Log Out"
              onClick={logout}
            />
          </div>
        </SideNav>{" "}
      </div>
      <main className="flex flex-col justify-end items-center gap-16 pt-24 pl-28 md:pl-24  w-full">
        <form className="flex flex-col mx-auto gap-8 justify-center items-center">
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
        </form>
        <div className="flex text-xs sm:text-lg gap-11 flex-col md:text-lg">
          <Button onClick={handleSubmit} variant="primary" size="md">
            Save Changes
          </Button>
          <Button onClick={handleDelete} variant="destructive" size="md">
            Delete Account
          </Button>
        </div>

        {showSuccessMsg && <span>User setting saved successfully.</span>}
      </main>
    </>
  );
};

export default Profile;
