import InputField from "../../../shared/components/InputField";
import { fieldConfig } from "../../auth/constants/registerFieldConfig";

type FormProps = {
  form: {
    username: string;
    email: string;
    password: string;
    avatar: string;
  };
  fieldsToRender: (typeof fieldConfig)[number]["name"][];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const ProfileForm = ({
  form,
  onChange,
  onSubmit,
  fieldsToRender,
}: FormProps) => {
  return (
    <div className="p-4">
      <form onSubmit={onSubmit}>
        {fieldConfig
          .filter((field) => fieldsToRender.includes(field.name))
          .map((field) => (
            <InputField
              key={field.name}
              label={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={onChange}
              icon={field.icon}
              autoComplete={field.autoComplete}
            />
          ))}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileForm;
