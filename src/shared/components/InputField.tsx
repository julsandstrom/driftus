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
    <>
      {" "}
      <div className="flex mb-4 gap-2 flex-row items-start ">
        {Icon && <Icon />}
        {label && <label htmlFor={name}>{label}</label>}
        <div className="w-full">
          {" "}
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={!errorMessages ? placeholder : `${errorMessages}`}
            className={`${classname} rounded-lg px-2 w-full`}
            autoComplete={autoComplete}
          />{" "}
        </div>
        {errorMessages && <p style={{ color: "red" }}>*</p>}{" "}
      </div>
    </>
  );
};

export default InputField;
