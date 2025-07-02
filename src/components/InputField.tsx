type InputFieldProps = {
  type?: "text" | "email" | "password" | "url";
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({
  type = "text",
  label,
  name,
  value,
  onChange,
}: InputFieldProps) => {
  return (
    <>
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} />
    </>
  );
};

export default InputField;
