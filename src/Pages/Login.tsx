import { useState } from "react";

import { useAuth } from "../context/AuthContext";

type User = {
  username: string;
  password: string;
};

const Login = () => {
  const [form, setForm] = useState<User>({
    username: "",
    password: "",
  });

  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
        credentials: "include",
      });

      const csrfData = await csrfRes.json();

      const res = await fetch("https://chatify-api.up.railway.app/auth/token", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          csrfToken: csrfData.csrfToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const token = data.token;

      login(token);

      console.log(login);
      console.log("login was successfull");
    } catch {
      console.log("Login failed!");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          name="username"
          type="text"
          required
          className="w-300 p-2 border"
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-300 p-2 border"
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
