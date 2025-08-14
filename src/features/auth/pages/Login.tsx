import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";

type User = {
  username: string;
  password: string;
};

type FromState = { from?: { pathname: string } };

const Login = () => {
  const [form, setForm] = useState<User>({
    username: "",
    password: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useAuth();

  const from = (location.state as FromState)?.from?.pathname ?? "/chat";

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

      if (!csrfRes.ok) throw new Error("Failed to get CSRF token");
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

      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error(data?.message ?? `HTTP ${res.status}`);

      const token = data.token;

      await login(token);

      navigate(from, { replace: true });

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
          className="w-[300px] p-2 border"
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
      <br />
      <div className="flex justify-center space-x-3 ">
        <h2 className="m-0 p-0">Create a new account</h2>
        <button className="m-0 p-1 " onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
