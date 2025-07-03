import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
type Form = {
  id: string;
  username: string;
  email: string;
  avatar: string;
};
const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form>({
    id: user?.id ?? "",
    username: user?.user ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar ?? "",
  });

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

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
        },
      }),
    });

    if (res.ok) {
      refreshUser();
      alert("Update was successful");
    } else {
      alert("Update failed.");
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
    <div className="p-4">
      <ProfileForm form={form} onChange={handleEdit} onSubmit={handleSave} />
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default Profile;
