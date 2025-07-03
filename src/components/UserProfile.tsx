import type { DecodedToken } from "../types";

type Props = {
  user: DecodedToken;
};

const UserProfile = ({ user }: Props) => {
  return <div>{user.user}</div>;
};

export default UserProfile;
