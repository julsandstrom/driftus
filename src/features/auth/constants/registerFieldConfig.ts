import { MailIcon, UserIcon, LockIcon, ImageIcon } from "lucide-react";

export const fieldConfig = [
  {
    label: "Username",
    name: "username",
    type: "text",
    placeholder: "Username",
    icon: UserIcon,
    autoComplete: "username",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Email",
    icon: MailIcon,
    autoComplete: "email",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: LockIcon,
    autoComplete: "new-password",
  },
  {
    label: "Avatar",
    name: "avatar",
    type: "text",
    placeholder: "Avatar URL (optional)",
    icon: ImageIcon,
    autoComplete: "off",
  },
] as const;
