import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import logoUrl from "../../../assets/DriftusLogo.svg";
import InputField from "../../../shared/components/InputField";
import { UserIcon, LockIcon } from "lucide-react";
import { Button } from "../../../shared/components/Button";

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

  const [loginError, setLoginError] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useAuth();

  const from = (location.state as FromState)?.from?.pathname ?? "/chat";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLoginError(false);
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

      if (!res.ok) {
        setLoginError(true);
        throw new Error(data?.message ?? `HTTP ${res.status}`);
      }

      const token = data.token;
      setLoginError(false);
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
        className="flex flex-col mx-auto gap-6 justify-center items-center"
      >
        <InputField
          type={"text"}
          name="username"
          icon={UserIcon}
          label="Username"
          placeholder={"username"}
          classname="w-[200px] h-[30px]"
          value={form.username}
          onChange={handleChange}
        />

        <InputField
          type={"password"}
          label={"Password"}
          icon={LockIcon}
          name="password"
          placeholder={"password"}
          value={form.password}
          classname="w-[200px] h-[30px]"
          onChange={handleChange}
        />

        <Button type="submit" size="md" variant="primary">
          Login
        </Button>
        {loginError && (
          <p id="login error" role="alert" className="text-red-600">
            Username or password is incorrect
          </p>
        )}
      </form>

      <br />
      <div className="flex justify-center items-center mt-8">
        <h2 className="m-0 p-0 text-xl">No account?</h2>
        <button
          className="m-0 p-1 hover:underline text-xl"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
