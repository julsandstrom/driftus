import { useAuth } from "../../../shared/hooks/useAuth";
import UserProfile from "../components/UserProfile";

const UserContainer = () => {
  const { user } = useAuth();
  if (!user) return <p>loading user...</p>;
  return <UserProfile user={user} />;
};

export default UserContainer;
