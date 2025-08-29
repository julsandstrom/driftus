export type MainIconProps = React.SVGProps<SVGSVGElement> & { title?: string };

export default function MainIcon({
  className,
  title,
  ...props
}: MainIconProps) {
  return (
    <svg
      width="126"
      height="166"
      viewBox="0 0 126 166"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M63 0.5C97.5451 0.5 125.5 26.9417 125.5 59.5C125.5 92.0583 97.5451 118.5 63 118.5C28.4549 118.5 0.5 92.0583 0.5 59.5C0.5 26.9417 28.4549 0.5 63 0.5Z"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M91.3861 112.5C92.2675 112.498 92.9313 112.719 93.4486 113.207C93.9801 113.708 94.4176 114.546 94.7172 115.896C95.0147 117.238 95.1642 119.036 95.1654 121.405C93.9904 130.305 90.8845 140.895 85.5863 149.438C80.289 157.979 72.8485 164.405 63.0101 165.163C53.9175 164.01 46.474 157.577 40.9857 149.126C35.4974 140.675 32.017 130.283 30.8334 121.398C30.8349 119.033 30.9863 117.237 31.2836 115.896C31.5831 114.546 32.0198 113.708 32.5511 113.207C33.0685 112.719 33.7323 112.498 34.6136 112.5C35.5104 112.502 36.598 112.737 37.9105 113.136C43.1273 114.721 51.4208 118.775 63.0004 118.775C74.5796 118.775 82.8725 114.721 88.0892 113.136C89.4017 112.737 90.4894 112.502 91.3861 112.5Z"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M85.8063 63.4854C76.9688 66.3259 69.9866 67.6677 62.9948 67.623C56.0036 67.5784 49.022 66.1484 40.1881 63.4727L62.9996 118.221L85.8063 63.4854Z"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
