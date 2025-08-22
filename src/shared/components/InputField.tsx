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
    <div className="flex flex-row gap-8 justify-between items-end mt-9 h-[40px]">
      <div className="flex gap-2">
        {" "}
        {Icon && <Icon />}
        {label && (
          <label htmlFor={name} className="text-xl font-medium">
            {label}
          </label>
        )}{" "}
      </div>
      <div className="flex flex-col justify-between">
        {" "}
        {errorMessages && <p className="text-red-600">{errorMessages}</p>}{" "}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={!errorMessages ? placeholder : `${errorMessages}`}
          className={`${classname} text-zinc-700 h-9 rounded-lg px-2 w-[210px] text-xl leading-none bg-white/90 shadow-sm ring-1 ring-zing-300 placeholder:text-black-400 transition focus:outline-none focus:ring-2 focus: ring-green-500/95`}
          autoComplete={autoComplete}
        />{" "}
      </div>
    </div>
  );
};

export default InputField;
