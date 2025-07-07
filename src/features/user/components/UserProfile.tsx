import type { DecodedToken } from "../../../shared/types";

type Props = {
  user: DecodedToken;
};

const UserProfile = ({ user }: Props) => {
  return <div>{user.user}</div>;
};

export default UserProfile;
