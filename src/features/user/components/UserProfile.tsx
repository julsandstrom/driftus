import type { DecodedToken } from "../../../shared/types";

type Props = {
  user: DecodedToken;
};

const UserProfile = ({ user }: Props) => {
  return (
    <div className="relative inline-block w-full text-left ml-5 md:text-2xl lg:text-4xl text-yellow-500 font-thin m-3">
      <span className="text-xs md:text-sm text-start absolute -top-2 left-0">
        #ID
      </span>
      <span>{user.user.toLocaleUpperCase()}</span>
    </div>
  );
};

export default UserProfile;
