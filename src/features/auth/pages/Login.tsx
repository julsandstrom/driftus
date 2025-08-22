import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import logoUrl from "../../../assets/DriftusLogo.svg";

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
      <img
        src={logoUrl}
        alt="DriftUs — Feel the message."
        className="block mx-auto w-[min(90vw,720px)] mb-11"
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mx-auto justify-center"
      >
        <div className="flex flex-col justify-center items-center gap-5">
          <div className="flex flex-col">
            <label>Username</label>
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              className="text-zinc-700 h-9 rounded-lg px-2 w-[210px] text-xl leading-none bg-white/90 shadow-sm ring-1 ring-zing-300 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 focus: ring-green-500/95 "
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="text-zinc-700 h-9 rounded-lg px-2 w-[210px] text-xl leading-none bg-white/90 shadow-sm ring-1 ring-zing-300 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 focus: ring-green-500/95"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className=" bg-yellow-500 text-black px-4 py-2 mt-5 w-[150px] rounded-xl transition ease-out duration-200 hover:ring-2 hover:ring-white/95
            hover:-translate-y-0.5"
          >
            Login
          </button>
        </div>
      </form>
      <br />
      <div className="flex justify-center items-center ">
        <h2 className="m-0 p-0 text-xl">No account?</h2>
        <button
          className="m-0 p-1 hover:underline"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
