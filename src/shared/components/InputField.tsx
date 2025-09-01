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
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
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
  onBlur,
  onFocus,
}: InputFieldProps) => {
  return (
    <>
      <div className="flex flex-col justify-between">
        {" "}
        <div className="flex justify-start">
          {Icon && <Icon />}
          {!errorMessages && (
            <label
              htmlFor={name}
              className="ml-1 text-xs md:text-xl font-medium self-end"
            >
              {label}
            </label>
          )}{" "}
          <span className="text-red-600 text-xs md:text-xl self-end">
            {errorMessages}
          </span>
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${classname} bg-white text-black font-thin  rounded-lg px-2 text-xl leading-none shadow-sm ring-1 ring-zing-300 placeholder:text-black-400 transition focus:outline-none focus:ring-2 focus: ring-green-500/95`}
          autoComplete={autoComplete}
          onFocus={onFocus}
          onBlur={onBlur}
        />{" "}
      </div>
    </>
  );
};

export default InputField;
