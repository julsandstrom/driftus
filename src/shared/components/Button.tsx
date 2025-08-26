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
    const isDisabled = !!(disabled || loading);

    const disabledClasses =
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

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
        onClick={isDisabled ? undefined : onClick}
        className={`${size} ${variantStyling}  ${disabledClasses} ${className}`}
        disabled={disabled || loading}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        title={title}
      >
        {" "}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
              fill="currentColor"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
