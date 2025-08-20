import type { DecodedToken } from "../../../shared/types";

type Props = {
  user: DecodedToken;
};

const UserProfile = ({ user }: Props) => {
  return (
    <div className=" w-full text-left ml-10 text-lg text-green-500 ">
      {user.user}
    </div>
  );
};

export default UserProfile;
