import React, { forwardRef } from "react";

type ButtonProps = {
  type?: "button" | "submit";
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  className?: string;
  size: "sm" | "md" | "lg" | "icon";
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  variant:
    | "default"
    | "primary"
    | "destructive"
    | "destructiveIcon"
    | "ghost"
    | "subtle";
};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      type = "button",
      children,
      onClick,
      ariaLabel,
      className,
      size = "md",
      disabled,
      loading,
      title,
    },
    ref
  ) => {
    const variantStyling =
      variant === "primary"
        ? " flex justify-center bg-[#BE9C3D] text-black px-4 py-2   rounded-xl transition ease-out duration-200 hover:ring-2 hover:ring-white/95 hover:-translate-y-0.5"
        : variant === "destructive"
        ? " flex justify-center bg-red-700 text-black px-4 py-2   rounded-xl transition ease-out duration-200 hover:ring-2 hover:ring-white/95 hover:-translate-y-0.5"
        : variant === "subtle"
        ? " flex justify-center bg-zinc-600 text-black px-4 py-2   rounded-xl transition ease-out duration-200 hover:ring-2 hover:ring-white/95 hover:-translate-y-0.5"
        : variant === "ghost"
        ? " flex justify-center bg-none text-white border py-2  rounded-xl transition ease-out duration-200 hover:ring-2 hover:ring-white/95 hover:-translate-y-0.5"
        : variant === "destructiveIcon"
        ? "flex justify-center items-center bg-none text-red-600  rounded-xl transition ease-out duration-200  hover:-translate-y-1 ml-2"
        : " flex justify-center bg-[#BE9C3D] text-black px-4 py-2   rounded-xl transition ease-out duration-200 hover:ring-2 hover:ring-white/95 hover:-translate-y-0.5";

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        onClick={onClick}
        className={`${size} ${variantStyling} ${className}`}
        disabled={disabled || loading}
        title={title}
      >
        {children}
      </button>
    );
  }
);
