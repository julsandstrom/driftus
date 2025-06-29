import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
type Form = {
  username: string | undefined;
  email: string | undefined;
  avatar: string | undefined;
};
type FormField = "username" | "email" | "avatar";
const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form>({
    username: user?.user,
    email: user?.email,
    avatar: user?.avatar,
  });

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({ ...prevForm, [name as FormField]: value }));
  };

  const handleSave = () => {};

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
      <form onSubmit={handleSave}>
        <label>Username: </label>
        <input name="username" value={form.username} onChange={handleEdit} />
        <label>Email: </label>
        <input name="email" value={form.email} onChange={handleEdit} />
        <label>Avatar: </label>
        <input name="avatar" value={form.avatar} onChange={handleEdit} />
        <button typeof="submit">Save Changes</button>
      </form>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default Profile;
