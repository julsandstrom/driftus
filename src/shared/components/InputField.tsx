import type { LucideIcon } from "lucide-react";

type InputFieldProps = {
  type?: "text" | "email" | "password" | "url";
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessages?: string;
  classname?: string;
  placeholder?: string;
  icon?: LucideIcon;
  autoComplete?: string;
};

const InputField = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  errorMessages,
  icon: Icon,
  classname,
  placeholder,
  autoComplete,
}: InputFieldProps) => {
  return (
    <div className="flex mb-4 gap-2 flex-row  ">
      {Icon && <Icon />}
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={classname}
        autoComplete={autoComplete}
      />{" "}
      {errorMessages && <p style={{ color: "red" }}>{errorMessages}</p>}{" "}
    </div>
  );
};

export default InputField;
