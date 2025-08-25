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
        ? " flex justify-center items-center bg-[#BE9C3D]  text-[#1A1A1A] px-4 py-2   rounded-xl transition ease-out duration-200 hover:bg-[#9E7E2F]  hover:-translate-y-0.5"
        : variant === "destructive"
        ? " flex justify-center items-center bg-[#BE3D3D]  text-[#FFFFFF] px-4 py-2   rounded-xl transition ease-out duration-200 hover:bg-[#9E2F2F] hover:-translate-y-0.5"
        : variant === "subtle"
        ? " flex justify-center items-center bg-none  text-[#1A1A1A] py-2   rounded-xl transition ease-out duration-200 hover:-translate-y-0.5 hover:underline"
        : variant === "ghost"
        ? " flex justify-center items-center bg-none text-white  py-2  rounded-xl transition ease-out duration-200 hover:underline hover:ring-white/95 hover:-translate-y-0.5"
        : variant === "destructiveIcon"
        ? "flex justify-center items-center items-center bg-none text-white-600  rounded-xl transition ease-out duration-200  hover:-translate-y-1 hover:text-red-600 ml-2"
        : " flex justify-center items-center px-4 py-2   rounded-xl transition ease-out duration-200  hover:-translate-y-0.5";

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
