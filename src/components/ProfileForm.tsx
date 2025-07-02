import InputField from "./InputField";
type FormProps = {
  form: {
    username: string;
    email: string;
    avatar: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const ProfileForm = ({ form, onChange, onSubmit }: FormProps) => {
  return (
    <div className="p-4">
      <form onSubmit={onSubmit}>
        <InputField
          label="username"
          name="username"
          value={form.username}
          onChange={onChange}
        />
        <InputField
          label="email"
          name="email"
          value={form.email}
          onChange={onChange}
        />
        <InputField
          label="avatar"
          name="avatar"
          value={form.avatar}
          onChange={onChange}
        />

        <button typeof="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileForm;
